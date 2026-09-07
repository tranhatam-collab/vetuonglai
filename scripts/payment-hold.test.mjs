import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('static public source retains payment HOLD, not a settlement readiness claim', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /data-i18n="tagHold">HOLD/);
  assert.match(html, /Chưa nhận thanh toán/);
  assert.match(html, /public operation has not yet been verified/);
  assert.doesNotMatch(html, /href=["']https:\/\/(?:buy\.stripe\.com|checkout\.stripe\.com|paypal\.me)\//);
});
