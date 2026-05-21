import {
  jsonResponse, currentUnixSeconds, platformStore, requireSession,
  readRequestJson, makeId, listKvByPrefix, isInternalCallAuthorized, isValidEmail,
} from "./runtime-helpers.mjs";

const BASE = "/api/notify";
const NOTIFICATION_TTL = 90 * 24 * 60 * 60;
const TEMPLATE_TTL = 365 * 24 * 60 * 60;
const TITLE_MAX = 140;
const BODY_MAX = 4000;
const RESEND_API_URL = "https://api.resend.com/emails";

const DEFAULT_TEMPLATES = {
  // Authentication
  magic_link: {
    subject_vi: "Liên kết đăng nhập của bạn — Vetuonglai",
    subject_en: "Your sign-in link — Vetuonglai",
    body_vi: "Xin chào,\n\nNhấn vào liên kết sau để đăng nhập:\n{magic_link_url}\n\nLinh kết hết hạn sau {expiry_minutes} phút. Không yêu cầu thì bỏ qua email này.",
    body_en: "Hi,\n\nClick the link below to sign in:\n{magic_link_url}\n\nThis link expires in {expiry_minutes} minutes. If you didn't request this, ignore this email.",
  },
  magic_link_resend: {
    subject_vi: "Gửi lại liên kết đăng nhập — Vetuonglai",
    subject_en: "Sign-in link resent — Vetuonglai",
    body_vi: "Xin chào,\n\nĐây là liên kết đăng nhập mới:\n{magic_link_url}\n\nLinh kết hết hạn sau {expiry_minutes} phút.",
    body_en: "Hi,\n\nHere is your new sign-in link:\n{magic_link_url}\n\nExpires in {expiry_minutes} minutes.",
  },
  security_alert: {
    subject_vi: "⚠️ Thông báo bảo mật tài khoản Vetuonglai",
    subject_en: "⚠️ Vetuonglai account security alert",
    body_vi: "Xin chào,\n\nCó hoạt động bảo mật trên tài khoản của bạn:\n{alert_message}\n\nNếu không phải bạn, vui lòng liên hệ support@vetuonglai.com ngay.",
    body_en: "Hi,\n\nSecurity activity was detected on your account:\n{alert_message}\n\nIf this wasn't you, contact support@vetuonglai.com immediately.",
  },
  welcome: {
    subject_vi: "Chào mừng bạn đến Vetuonglai! 🎉",
    subject_en: "Welcome to Vetuonglai! 🎉",
    body_vi: "Xin chào {first_name},\n\nTài khoản của bạn đã được tạo thành công.\n\nĐịa chỉ ví VTL của bạn: {wallet_address}\n\nBắt đầu hành trình tại: https://member.vetuonglai.com/journey/",
    body_en: "Hi {first_name},\n\nYour account has been created successfully.\n\nYour VTL wallet address: {wallet_address}\n\nStart your journey at: https://member.vetuonglai.com/journey/",
  },
  account_deletion_confirm: {
    subject_vi: "Xác nhận xoá tài khoản Vetuonglai",
    subject_en: "Confirm Vetuonglai account deletion",
    body_vi: "Xin chào,\n\nChúng tôi nhận được yêu cầu xoá tài khoản của bạn. Xác nhận tại:\n{confirm_url}\n\nNếu không yêu cầu, bỏ qua email này.",
    body_en: "Hi,\n\nWe received a request to delete your account. Confirm at:\n{confirm_url}\n\nIf you didn't request this, ignore this email.",
  },
  // Payment lifecycle
  payment_started: {
    subject_vi: "Đang xử lý thanh toán {amount} VND",
    subject_en: "Processing your payment of {amount} VND",
    body_vi: "Xin chào,\n\nChúng tôi đang xử lý thanh toán {amount} VND qua {provider}. Mã giao dịch: {transaction_id}.\n\nBạn sẽ nhận email xác nhận ngay khi hoàn tất.",
    body_en: "Hi,\n\nWe're processing your payment of {amount} VND via {provider}. Transaction ID: {transaction_id}.\n\nYou'll receive a confirmation email once complete.",
  },
  payment_pending: {
    subject_vi: "Thanh toán đang chờ xác nhận",
    subject_en: "Your payment is pending confirmation",
    body_vi: "Xin chào,\n\nThanh toán {amount} VND (mã: {transaction_id}) đang chờ xác nhận từ {provider}. Thường mất 1-3 phút.",
    body_en: "Hi,\n\nPayment of {amount} VND (ID: {transaction_id}) is awaiting confirmation from {provider}. This typically takes 1-3 minutes.",
  },
  payment_success: {
    subject_vi: "✅ Thanh toán thành công — {product_name}",
    subject_en: "✅ Payment successful — {product_name}",
    body_vi: "Xin chào,\n\nThanh toán {amount} VND cho {product_name} đã thành công!\n\nMã giao dịch: {transaction_id}\nNgày: {payment_date}\n\nTruy cập ngay tại: {access_url}",
    body_en: "Hi,\n\nYour payment of {amount} VND for {product_name} was successful!\n\nTransaction ID: {transaction_id}\nDate: {payment_date}\n\nAccess now at: {access_url}",
  },
  payment_failed: {
    subject_vi: "❌ Thanh toán thất bại — vui lòng thử lại",
    subject_en: "❌ Payment failed — please try again",
    body_vi: "Xin chào,\n\nThanh toán {amount} VND qua {provider} không thành công. Lý do: {failure_reason}.\n\nVui lòng thử lại tại: {retry_url}",
    body_en: "Hi,\n\nYour payment of {amount} VND via {provider} was unsuccessful. Reason: {failure_reason}.\n\nPlease try again at: {retry_url}",
  },
  refund_initiated: {
    subject_vi: "Hoàn tiền đang được xử lý — {amount} VND",
    subject_en: "Refund initiated — {amount} VND",
    body_vi: "Xin chào,\n\nYêu cầu hoàn tiền {amount} VND (mã: {refund_id}) đang được xử lý. Thời gian hoàn tiền: {estimated_days} ngày làm việc.",
    body_en: "Hi,\n\nYour refund of {amount} VND (ID: {refund_id}) is being processed. Estimated return: {estimated_days} business days.",
  },
  refund_completed: {
    subject_vi: "✅ Đã hoàn tiền {amount} VND thành công",
    subject_en: "✅ Refund of {amount} VND completed",
    body_vi: "Xin chào,\n\nHoàn tiền {amount} VND (mã: {refund_id}) đã hoàn tất. Tiền sẽ về tài khoản gốc trong 3-5 ngày làm việc.",
    body_en: "Hi,\n\nYour refund of {amount} VND (ID: {refund_id}) has been processed. Funds should appear in your original account within 3-5 business days.",
  },
  invoice_receipt: {
    subject_vi: "Hoá đơn #{invoice_id} — Vetuonglai",
    subject_en: "Invoice #{invoice_id} — Vetuonglai",
    body_vi: "Xin chào,\n\nHoá đơn #{invoice_id} cho đơn hàng {product_name} ({amount} VND) đã sẵn sàng:\n{invoice_url}\n\nMã giao dịch: {transaction_id} · Ngày: {payment_date}",
    body_en: "Hi,\n\nInvoice #{invoice_id} for {product_name} ({amount} VND) is ready:\n{invoice_url}\n\nTransaction ID: {transaction_id} · Date: {payment_date}",
  },
  payment_unlock_magic_link: {
    subject_vi: "Thanh toán thành công — Đăng nhập ngay để truy cập",
    subject_en: "Payment complete — Sign in to access your purchase",
    body_vi: "Xin chào,\n\nThanh toán {amount} VND cho {product_name} đã xong. Nhấn vào đây để đăng nhập và truy cập ngay:\n{magic_link_url}\n\nLinh kết hết hạn sau {expiry_minutes} phút.",
    body_en: "Hi,\n\nPayment of {amount} VND for {product_name} complete. Click here to sign in and access your purchase:\n{magic_link_url}\n\nExpires in {expiry_minutes} minutes.",
  },
  // Wallet lifecycle
  wallet_debit: {
    subject_vi: "Ví của bạn đã bị trừ {amount} VND",
    subject_en: "Your wallet was debited {amount} VND",
    body_vi: "Xin chào,\n\nVí VTL của bạn vừa bị trừ {amount} VND. Lý do: {reason}. Số dư còn lại: {balance_available} VND.",
    body_en: "Hi,\n\nYour VTL wallet was debited {amount} VND. Reason: {reason}. Remaining balance: {balance_available} VND.",
  },
  withdrawal_requested: {
    subject_vi: "Yêu cầu rút tiền {amount} VND đã nhận",
    subject_en: "Withdrawal request of {amount} VND received",
    body_vi: "Xin chào,\n\nYêu cầu rút {amount} VND (mã: {payout_id}) đã được nhận. Sau khi trừ phí {fee_vnd} VND, bạn sẽ nhận {net_vnd} VND. Xử lý trong {processing_days} ngày làm việc.",
    body_en: "Hi,\n\nYour withdrawal request of {amount} VND (ID: {payout_id}) has been received. After fee of {fee_vnd} VND, you'll receive {net_vnd} VND. Processing within {processing_days} business days.",
  },
  withdrawal_completed: {
    subject_vi: "✅ Đã chuyển khoản {net_vnd} VND thành công",
    subject_en: "✅ Transfer of {net_vnd} VND completed",
    body_vi: "Xin chào,\n\nChuyển khoản {net_vnd} VND (mã: {payout_id}) đã hoàn tất. Mã tham chiếu ngân hàng: {bank_ref}.",
    body_en: "Hi,\n\nTransfer of {net_vnd} VND (ID: {payout_id}) has been completed. Bank reference: {bank_ref}.",
  },
  withdrawal_failed: {
    subject_vi: "❌ Rút tiền thất bại — vui lòng liên hệ hỗ trợ",
    subject_en: "❌ Withdrawal failed — please contact support",
    body_vi: "Xin chào,\n\nRút tiền {amount} VND (mã: {payout_id}) thất bại. Lý do: {failure_reason}. Số tiền đã được hoàn lại vào ví.\n\nLiên hệ: support@vetuonglai.com",
    body_en: "Hi,\n\nWithdrawal of {amount} VND (ID: {payout_id}) failed. Reason: {failure_reason}. The amount has been returned to your wallet.\n\nContact: support@vetuonglai.com",
  },
  // KYC lifecycle
  kyc_started: {
    subject_vi: "Đã nhận hồ sơ KYC của bạn",
    subject_en: "Your KYC submission received",
    body_vi: "Xin chào,\n\nHồ sơ xác minh danh tính (KYC) của bạn đã được nhận (mã: {kyc_id}). Chúng tôi sẽ xem xét trong vòng {review_hours} giờ làm việc.",
    body_en: "Hi,\n\nYour identity verification (KYC) submission has been received (ID: {kyc_id}). We'll review it within {review_hours} business hours.",
  },
  kyc_pending_review: {
    subject_vi: "Hồ sơ KYC đang được xem xét",
    subject_en: "KYC submission under review",
    body_vi: "Xin chào,\n\nHồ sơ KYC của bạn (mã: {kyc_id}) đang được xem xét bởi nhóm của chúng tôi. Bạn sẽ nhận email kết quả sớm.",
    body_en: "Hi,\n\nYour KYC submission (ID: {kyc_id}) is being reviewed by our team. You'll receive a result email shortly.",
  },
  kyc_approved: {
    subject_vi: "✅ KYC đã được xác minh — cấp độ {kyc_level}",
    subject_en: "✅ KYC verified — level {kyc_level}",
    body_vi: "Xin chào,\n\nKYC của bạn (mã: {kyc_id}) đã được xác minh thành công ở cấp độ '{kyc_level}'. Bạn hiện có thể rút tiền và sử dụng đầy đủ dịch vụ.",
    body_en: "Hi,\n\nYour KYC (ID: {kyc_id}) has been verified at level '{kyc_level}'. You can now withdraw funds and use all services.",
  },
  kyc_rejected: {
    subject_vi: "❌ KYC chưa được chấp nhận — cần bổ sung",
    subject_en: "❌ KYC not accepted — action required",
    body_vi: "Xin chào,\n\nHồ sơ KYC (mã: {kyc_id}) chưa được chấp nhận. Lý do: {rejection_reason}.\n\nVui lòng nộp lại tại: {resubmit_url}",
    body_en: "Hi,\n\nYour KYC submission (ID: {kyc_id}) was not accepted. Reason: {rejection_reason}.\n\nPlease resubmit at: {resubmit_url}",
  },
  kyc_more_info: {
    subject_vi: "Cần thêm thông tin để hoàn tất KYC",
    subject_en: "Additional information needed for KYC",
    body_vi: "Xin chào,\n\nChúng tôi cần thêm thông tin để hoàn tất KYC (mã: {kyc_id}).\n\nYêu cầu: {info_requested}\n\nCập nhật tại: {update_url}",
    body_en: "Hi,\n\nWe need additional information to complete your KYC (ID: {kyc_id}).\n\nRequired: {info_requested}\n\nUpdate at: {update_url}",
  },
  // Original templates
  wallet_credited: {
    subject_vi: "Ví của bạn vừa được cộng {amount} VND",
    subject_en: "Your wallet was credited {amount} VND",
    body_vi: "Xin chào {recipient_email}, ví VTL của bạn vừa được cộng {amount} VND từ {source}.",
    body_en: "Hi {recipient_email}, your VTL wallet was credited {amount} VND from {source}.",
  },
  job_application_received: {
    subject_vi: "Có ứng viên mới cho tin tuyển dụng của bạn",
    subject_en: "New applicant for your job listing",
    body_vi: "{applicant} vừa ứng tuyển vào: {listing_title}.",
    body_en: "{applicant} just applied to: {listing_title}.",
  },
  community_reply: {
    subject_vi: "Có người vừa trả lời bài của bạn",
    subject_en: "Someone replied to your post",
    body_vi: "{author} đã trả lời bài của bạn: {post_title}.",
    body_en: "{author} replied to your post: {post_title}.",
  },
  generic: {
    subject_vi: "{subject}",
    subject_en: "{subject}",
    body_vi: "{body}",
    body_en: "{body}",
  },
};

function applyTemplate(tpl, lang, vars) {
  const subjectKey = lang === "en" ? "subject_en" : "subject_vi";
  const bodyKey = lang === "en" ? "body_en" : "body_vi";
  let subject = tpl[subjectKey] || tpl.subject_vi || "";
  let body = tpl[bodyKey] || tpl.body_vi || "";
  for (const [k, v] of Object.entries(vars || {})) {
    const re = new RegExp(`\\{${k}\\}`, "g");
    subject = subject.replace(re, String(v ?? ""));
    body = body.replace(re, String(v ?? ""));
  }
  return { subject: subject.slice(0, TITLE_MAX), body: body.slice(0, BODY_MAX) };
}

async function loadTemplate(env, name) {
  const store = platformStore(env);
  const custom = await store.get("notify_template", name);
  if (custom) return custom;
  return DEFAULT_TEMPLATES[name] || DEFAULT_TEMPLATES.generic;
}

function buildEmailHtml(subject, body, lang, env) {
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const accentColor = "#818CF8";
  const footer = lang === "en"
    ? `<p style="font-size:12px;color:#999;margin-top:24px">Vetuonglai · <a href="https://vetuonglai.com/legal/privacy/" style="color:#818CF8">Privacy</a> · <a href="https://vetuonglai.com/contact/" style="color:#818CF8">Contact</a></p>`
    : `<p style="font-size:12px;color:#999;margin-top:24px">Vetuonglai · <a href="https://vetuonglai.com/legal/privacy/" style="color:#818CF8">Chính sách riêng tư</a> · <a href="https://vetuonglai.com/contact/" style="color:#818CF8">Liên hệ</a></p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;padding:24px"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;border:1px solid #eee"><div style="border-bottom:3px solid ${accentColor};padding-bottom:12px;margin-bottom:24px"><span style="font-size:18px;font-weight:700;color:${accentColor}">Vetuonglai</span></div><h2 style="font-size:20px;font-weight:600;color:#1a1a2e;margin-bottom:16px">${esc(subject)}</h2><div style="font-size:15px;color:#444;line-height:1.6">${esc(body)}</div>${footer}</div></body></html>`;
}

async function deliverViaResend(env, record) {
  // Only attempt if RESEND_API_KEY is set — otherwise silently skip (stays KV-only)
  if (!env.RESEND_API_KEY) return { attempted: false, reason: "no_key" };
  const from = env.RESEND_FROM_EMAIL || "noreply@vetuonglai.com";
  const payload = {
    from,
    to: [record.recipient_email],
    subject: record.subject,
    text: record.body,
    // html version: wrap body in minimal branded wrapper
    html: buildEmailHtml(record.subject, record.body, record.lang, env),
    headers: {
      "X-Notify-Id": record.id,
      "X-Template": record.template,
    },
  };
  try {
    const resp = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await resp.json().catch(() => ({}));
    return {
      attempted: true,
      accepted: resp.status >= 200 && resp.status < 300,
      provider: "resend",
      message_id: body.id || null,
      status: resp.status,
    };
  } catch (err) {
    return { attempted: true, accepted: false, provider: "resend", error: String(err?.message || err) };
  }
}

async function handleSend(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({ status: "internal_token_required" }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const recipient = String(input.recipient_email || "").trim().toLowerCase();
  if (!isValidEmail(recipient)) {
    return jsonResponse({ status: "recipient_invalid" }, { status: 422 });
  }
  const templateName = String(input.template || "generic").trim();
  const lang = (input.lang === "en") ? "en" : "vi";
  const vars = { recipient_email: recipient, ...(input.vars || {}) };
  const tpl = await loadTemplate(env, templateName);
  const rendered = applyTemplate(tpl, lang, vars);

  const id = makeId("NOTIF_");
  const record = {
    id,
    recipient_email: recipient,
    template: templateName,
    lang,
    subject: rendered.subject,
    body: rendered.body,
    channels: Array.isArray(input.channels) ? input.channels : ["inbox"],
    status: "queued",
    created_at: currentUnixSeconds(),
    delivered_at: null,
    delivery_provider: null,
  };

  const store = platformStore(env);
  await store.put("notify_message", `${recipient}:${id}`, record, { ttlSeconds: NOTIFICATION_TTL });
  await store.put("notify_inbox", `${recipient}:${id}`, { id, unread: true }, { ttlSeconds: NOTIFICATION_TTL });

  const delivery = await deliverViaResend(env, record);
  if (delivery.attempted) {
    record.delivered_at = delivery.accepted ? currentUnixSeconds() : null;
    record.delivery_provider = delivery.provider || null;
    record.delivery_message_id = delivery.message_id || null;
    // Update the KV record with delivery status
    await store.put("notify_message", `${recipient}:${id}`, record, { ttlSeconds: NOTIFICATION_TTL });
  }

  return jsonResponse({ status: "notification_queued", notification: record }, { status: 202 });
}

async function handleInbox(request, env) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const data = await listKvByPrefix(env, `notify_inbox:${ctx.session.candidate_email}`, { limit: 50 });
  const store = platformStore(env);
  const messages = [];
  for (const item of data.entries) {
    const ref = item.value;
    if (!ref?.id) continue;
    const msg = await store.get("notify_message", `${ctx.session.candidate_email}:${ref.id}`);
    if (msg) messages.push({ ...msg, unread: ref.unread !== false });
  }
  messages.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  return jsonResponse({ status: "inbox_ok", messages });
}

async function handleMarkRead(request, env, id) {
  const ctx = await requireSession(request, env);
  if (ctx.response) return ctx.response;
  const store = platformStore(env);
  const inboxKey = `${ctx.session.candidate_email}:${id}`;
  const ref = await store.get("notify_inbox", inboxKey);
  if (!ref) return jsonResponse({ status: "not_found" }, { status: 404 });
  ref.unread = false;
  ref.read_at = currentUnixSeconds();
  await store.put("notify_inbox", inboxKey, ref, { ttlSeconds: NOTIFICATION_TTL });
  return jsonResponse({ status: "marked_read" });
}

async function handleSetTemplate(request, env) {
  if (!isInternalCallAuthorized(request, env)) {
    return jsonResponse({ status: "internal_token_required" }, { status: 401 });
  }
  const input = await readRequestJson(request);
  const name = String(input.name || "").trim();
  if (!name) return jsonResponse({ status: "name_required" }, { status: 422 });
  const tpl = {
    subject_vi: String(input.subject_vi || "").slice(0, 200),
    subject_en: String(input.subject_en || input.subject_vi || "").slice(0, 200),
    body_vi: String(input.body_vi || "").slice(0, 4000),
    body_en: String(input.body_en || input.body_vi || "").slice(0, 4000),
    updated_at: currentUnixSeconds(),
  };
  const store = platformStore(env);
  await store.put("notify_template", name, tpl, { ttlSeconds: TEMPLATE_TTL });
  return jsonResponse({ status: "template_saved", name, template: tpl });
}

export async function maybeHandleNotifyRuntime(request, env = {}) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE)) return null;

  if (request.method === "GET" && url.pathname === `${BASE}/health`) {
    return jsonResponse({
      status: "notify_ok",
      templates: Object.keys(DEFAULT_TEMPLATES),
      delivery: env.RESEND_API_KEY ? "resend_active" : "kv_only",
    });
  }
  if (request.method === "POST" && url.pathname === `${BASE}/send`) {
    return handleSend(request, env);
  }
  if (request.method === "POST" && url.pathname === `${BASE}/template`) {
    return handleSetTemplate(request, env);
  }
  if (request.method === "GET" && url.pathname === `${BASE}/inbox`) {
    return handleInbox(request, env);
  }
  const markMatch = url.pathname.match(/^\/api\/notify\/inbox\/([^/]+)\/read$/);
  if (markMatch && request.method === "POST") {
    return handleMarkRead(request, env, markMatch[1]);
  }
  return jsonResponse({ status: "notify_route_not_found", path: url.pathname }, { status: 404 });
}
