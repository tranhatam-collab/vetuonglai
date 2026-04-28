-- ============================================================================
-- trust.iai.one — Production Database Schema
-- PostgreSQL 15+
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE auth_provider_enum AS ENUM ('magic_link', 'google');
CREATE TYPE plan_enum AS ENUM ('free', 'pro', 'business', 'enterprise');
CREATE TYPE credential_status_enum AS ENUM ('active', 'revoked', 'expired', 'suspended');
CREATE TYPE asset_status_enum AS ENUM ('minted', 'transferred', 'burned');
CREATE TYPE verification_result_enum AS ENUM ('valid', 'invalid', 'expired', 'revoked');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'canceled', 'past_due');
CREATE TYPE payment_provider_enum AS ENUM ('stripe', 'paypal', 'bank_vn');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE usage_action_enum AS ENUM ('proof.create', 'vc.issue', 'vc.revoke', 'asset.mint', 'asset.transfer', 'verify');

-- ============================================================================
-- 1. USERS
-- ============================================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(255),
    avatar_url      TEXT,
    auth_provider   auth_provider_enum NOT NULL DEFAULT 'magic_link',
    plan            plan_enum NOT NULL DEFAULT 'free',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    email_verified_at TIMESTAMPTZ
);

COMMENT ON TABLE users IS 'Registered users. Auth via magic link or Google OAuth.';

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_plan ON users (plan);
CREATE INDEX idx_users_created_at ON users (created_at);

-- ============================================================================
-- 2. SESSIONS
-- ============================================================================

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(128) NOT NULL UNIQUE,
    ip          INET,
    user_agent  TEXT,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE sessions IS 'Active user sessions for magic-link and OAuth flows.';

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_token_hash ON sessions (token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

-- ============================================================================
-- 3. API KEYS
-- ============================================================================

CREATE TABLE api_keys (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash                VARCHAR(128) NOT NULL UNIQUE,
    name                    VARCHAR(255) NOT NULL,
    permissions             JSONB NOT NULL DEFAULT '[]'::jsonb,
    rate_limit_per_minute   INT NOT NULL DEFAULT 60 CHECK (rate_limit_per_minute > 0),
    usage_count             BIGINT NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    last_used_at            TIMESTAMPTZ,
    revoked_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE api_keys IS 'API keys with per-key rate limits, permissions, and usage tracking.';

CREATE INDEX idx_api_keys_user_id ON api_keys (user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys (key_hash);

-- ============================================================================
-- 4. PROJECTS
-- ============================================================================

CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE projects IS 'Enterprise batch-operation containers.';

CREATE INDEX idx_projects_user_id ON projects (user_id);

-- ============================================================================
-- 5. PROOFS (Proof Engine)
-- ============================================================================

CREATE TABLE proofs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_hash   VARCHAR(64) NOT NULL,  -- SHA-256 hex
    file_name   VARCHAR(512),
    file_size   BIGINT CHECK (file_size >= 0),
    algorithm   VARCHAR(16) NOT NULL DEFAULT 'sha256',
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    ipfs_cid    VARCHAR(128),
    verify_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_proofs_algorithm CHECK (algorithm IN ('sha256', 'sha384', 'sha512'))
);

COMMENT ON TABLE proofs IS 'Immutable file-hash proofs with optional IPFS pinning.';

CREATE INDEX idx_proofs_user_id ON proofs (user_id);
CREATE INDEX idx_proofs_file_hash ON proofs (file_hash);
CREATE INDEX idx_proofs_created_at ON proofs (created_at);

-- ============================================================================
-- 6. CREDENTIALS (VC Engine)
-- ============================================================================

CREATE TABLE credentials (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proof_id            UUID REFERENCES proofs(id) ON DELETE SET NULL,
    subject_name        VARCHAR(255) NOT NULL,
    subject_identifier  VARCHAR(512) NOT NULL,
    issuer_name         VARCHAR(255) NOT NULL,
    issuer_did          VARCHAR(512),
    credential_type     VARCHAR(128) NOT NULL,
    status              credential_status_enum NOT NULL DEFAULT 'active',
    issued_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at          TIMESTAMPTZ,
    revoked_at          TIMESTAMPTZ,
    revocation_reason   TEXT,
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    verify_url          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE credentials IS 'W3C-style Verifiable Credentials: issue, revoke, expire, verify.';

CREATE INDEX idx_credentials_user_id ON credentials (user_id);
CREATE INDEX idx_credentials_proof_id ON credentials (proof_id);
CREATE INDEX idx_credentials_status ON credentials (status);
CREATE INDEX idx_credentials_created_at ON credentials (created_at);

-- ============================================================================
-- 7. ASSETS (Asset Engine)
-- ============================================================================

CREATE TABLE assets (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_id     UUID REFERENCES credentials(id) ON DELETE SET NULL,
    token_id          VARCHAR(128),
    contract_address  VARCHAR(128),
    chain             VARCHAR(32) NOT NULL DEFAULT 'polygon',
    owner_address     VARCHAR(128) NOT NULL,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    mint_tx_hash      VARCHAR(128),
    status            asset_status_enum NOT NULL DEFAULT 'minted',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE assets IS 'On-chain tokenized assets (NFTs) linked to credentials.';

CREATE INDEX idx_assets_user_id ON assets (user_id);
CREATE INDEX idx_assets_credential_id ON assets (credential_id);
CREATE INDEX idx_assets_owner_address ON assets (owner_address);
CREATE INDEX idx_assets_status ON assets (status);
CREATE INDEX idx_assets_chain ON assets (chain);

-- ============================================================================
-- 8. ASSET TRANSFERS
-- ============================================================================

CREATE TABLE asset_transfers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    from_address    VARCHAR(128) NOT NULL,
    to_address      VARCHAR(128) NOT NULL,
    tx_hash         VARCHAR(128) NOT NULL,
    transferred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE asset_transfers IS 'Ownership transfer history for on-chain assets.';

CREATE INDEX idx_asset_transfers_asset_id ON asset_transfers (asset_id);
CREATE INDEX idx_asset_transfers_tx_hash ON asset_transfers (tx_hash);

-- ============================================================================
-- 9. VERIFICATIONS
-- ============================================================================

CREATE TABLE verifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_id        UUID REFERENCES proofs(id) ON DELETE SET NULL,
    credential_id   UUID REFERENCES credentials(id) ON DELETE SET NULL,
    asset_id        UUID REFERENCES assets(id) ON DELETE SET NULL,
    verifier_ip     INET,
    verifier_ua     TEXT,
    result          verification_result_enum NOT NULL,
    verified_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_verifications_one_target CHECK (
        (proof_id IS NOT NULL)::int +
        (credential_id IS NOT NULL)::int +
        (asset_id IS NOT NULL)::int = 1
    )
);

COMMENT ON TABLE verifications IS 'Audit log of every verification request and its result.';

CREATE INDEX idx_verifications_proof_id ON verifications (proof_id);
CREATE INDEX idx_verifications_credential_id ON verifications (credential_id);
CREATE INDEX idx_verifications_asset_id ON verifications (asset_id);
CREATE INDEX idx_verifications_verified_at ON verifications (verified_at);

-- ============================================================================
-- 10. BILLING PLANS
-- ============================================================================

CREATE TABLE billing_plans (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(64) NOT NULL,
    code            plan_enum NOT NULL UNIQUE,
    price_usd       NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price_vnd       NUMERIC(14, 0) NOT NULL DEFAULT 0,
    proof_limit     INT NOT NULL DEFAULT 0,   -- 0 = unlimited
    vc_limit        INT NOT NULL DEFAULT 0,
    asset_limit     INT NOT NULL DEFAULT 0,
    api_calls_limit INT NOT NULL DEFAULT 0,
    features        JSONB NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE billing_plans IS 'Available subscription tiers with limits and pricing.';

-- ============================================================================
-- 11. SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                 INT NOT NULL REFERENCES billing_plans(id) ON DELETE RESTRICT,
    status                  subscription_status_enum NOT NULL DEFAULT 'active',
    payment_provider        payment_provider_enum NOT NULL,
    payment_provider_id     VARCHAR(255),
    current_period_start    TIMESTAMPTZ NOT NULL DEFAULT now(),
    current_period_end      TIMESTAMPTZ NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE subscriptions IS 'User subscriptions. Supports Stripe, PayPal, VN bank QR.';

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);

-- ============================================================================
-- 12. PAYMENTS
-- ============================================================================

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id     UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount_usd          NUMERIC(10, 2),
    amount_vnd          NUMERIC(14, 0),
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'VND')),
    payment_provider    payment_provider_enum NOT NULL,
    payment_provider_id VARCHAR(255),
    status              payment_status_enum NOT NULL DEFAULT 'pending',
    paid_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE payments IS 'Individual payment records across all providers.';

CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_subscription_id ON payments (subscription_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_created_at ON payments (created_at);

-- ============================================================================
-- 13. USAGE LOGS
-- ============================================================================

CREATE TABLE usage_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_key_id  UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    action      usage_action_enum NOT NULL,
    resource_id UUID,
    ip          INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE usage_logs IS 'Append-only audit trail of every billable API action.';

CREATE INDEX idx_usage_logs_user_id ON usage_logs (user_id);
CREATE INDEX idx_usage_logs_api_key_id ON usage_logs (api_key_id);
CREATE INDEX idx_usage_logs_action ON usage_logs (action);
CREATE INDEX idx_usage_logs_created_at ON usage_logs (created_at);

-- ============================================================================
-- 14. WEBHOOK EVENTS
-- ============================================================================

CREATE TABLE webhook_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider        VARCHAR(64) NOT NULL,
    event_type      VARCHAR(128) NOT NULL,
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE webhook_events IS 'Inbound webhook events from Stripe, PayPal, etc. for idempotent processing.';

CREATE INDEX idx_webhook_events_provider ON webhook_events (provider);
CREATE INDEX idx_webhook_events_processed_at ON webhook_events (processed_at);
CREATE INDEX idx_webhook_events_created_at ON webhook_events (created_at);

-- ============================================================================
-- SEED: Billing Plans
-- ============================================================================

INSERT INTO billing_plans (name, code, price_usd, price_vnd, proof_limit, vc_limit, asset_limit, api_calls_limit, features) VALUES
(
    'Free', 'free', 0, 0,
    50, 10, 5, 1000,
    '["basic_verification", "email_support"]'::jsonb
),
(
    'Pro', 'pro', 19.00, 475000,
    500, 100, 50, 10000,
    '["basic_verification", "api_access", "priority_support", "custom_branding"]'::jsonb
),
(
    'Business', 'business', 79.00, 1975000,
    5000, 1000, 500, 100000,
    '["basic_verification", "api_access", "priority_support", "custom_branding", "team_management", "webhooks", "bulk_operations"]'::jsonb
),
(
    'Enterprise', 'enterprise', 299.00, 7475000,
    0, 0, 0, 0,  -- 0 = unlimited
    '["basic_verification", "api_access", "dedicated_support", "custom_branding", "team_management", "webhooks", "bulk_operations", "sla", "on_premise", "custom_integrations"]'::jsonb
);

-- ============================================================================
-- Updated-at trigger helper
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
