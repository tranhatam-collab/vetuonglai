# Email Templates Copy Spec — 2026-05-21

> 27 templates. All variables are `{snake_case}`. HTML-escape all variable values before injection — never trust raw user input in template bodies.
>
> Standard footer appended to every template (see end of doc).

---

## Group 1 — Authentication (5 templates)

### `magic_link`

**Variables**: `{member_name}`, `{magic_link_url}`, `{expiry_minutes}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Liên kết đăng nhập của bạn — Về Tương Lai | Your sign-in link — Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nBấm vào liên kết bên dưới để đăng nhập. Liên kết hết hạn sau {expiry_minutes} phút.\n\n{magic_link_url}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này. | Hi {member_name},\n\nClick the link below to sign in. The link expires in {expiry_minutes} minutes.\n\n{magic_link_url}\n\nIf you didn't request this, ignore this email. |

---

### `magic_link_resend`

**Variables**: `{member_name}`, `{magic_link_url}`, `{expiry_minutes}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Liên kết mới — Về Tương Lai | New sign-in link — Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nĐây là liên kết đăng nhập mới của bạn (liên kết trước đã hết hạn). Hết hạn sau {expiry_minutes} phút.\n\n{magic_link_url} | Hi {member_name},\n\nHere is your new sign-in link (the previous one expired). Expires in {expiry_minutes} minutes.\n\n{magic_link_url} |

---

### `security_alert`

**Variables**: `{member_name}`, `{event_description}`, `{timestamp}`, `{ip_address}`, `{support_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Cảnh báo bảo mật — Về Tương Lai | Security alert — Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nChúng tôi phát hiện hoạt động bảo mật trên tài khoản của bạn:\n\n{event_description}\n\nThời gian: {timestamp}\nĐịa chỉ IP: {ip_address}\n\nNếu đây không phải bạn, hãy liên hệ hỗ trợ ngay: {support_url} | Hi {member_name},\n\nWe detected a security event on your account:\n\n{event_description}\n\nTime: {timestamp}\nIP address: {ip_address}\n\nIf this wasn't you, contact support immediately: {support_url} |

---

### `welcome`

**Variables**: `{member_name}`, `{dashboard_url}`, `{first_step_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Chào mừng đến Về Tương Lai | Welcome to Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nTài khoản của bạn đã sẵn sàng.\n\nVề Tương Lai là nơi bạn xây dựng tương lai tài chính, sự nghiệp và cuộc sống theo cách của mình — thật, ấm, thực tế.\n\nBắt đầu tại đây: {first_step_url}\nHoặc vào trang tổng quan: {dashboard_url} | Hi {member_name},\n\nYour account is ready.\n\nVề Tương Lai is where you build your financial future, career, and life on your own terms — genuine, warm, practical.\n\nGet started here: {first_step_url}\nOr go to your dashboard: {dashboard_url} |

---

### `account_deletion_confirm`

**Variables**: `{member_name}`, `{deletion_date}`, `{cancel_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Xác nhận xóa tài khoản — Về Tương Lai | Account deletion confirmed — Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nYêu cầu xóa tài khoản của bạn đã được ghi nhận. Tài khoản sẽ bị xóa vào {deletion_date}.\n\nNếu bạn muốn hủy, bấm vào đây trước ngày đó: {cancel_url}\n\nSau ngày đó, tất cả dữ liệu sẽ bị xóa vĩnh viễn. | Hi {member_name},\n\nYour account deletion request has been recorded. Your account will be deleted on {deletion_date}.\n\nIf you want to cancel, click here before that date: {cancel_url}\n\nAfter that date, all data will be permanently deleted. |

---

## Group 2 — Payment lifecycle (8 templates)

### `payment_started`

**Variables**: `{member_name}`, `{product_name}`, `{amount_vnd}`, `{payment_method}`, `{invoice_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Đang xử lý thanh toán — {product_name} | Payment processing — {product_name} |
| **Body** | Xin chào {member_name},\n\nChúng tôi đã nhận được yêu cầu thanh toán của bạn.\n\nSản phẩm: {product_name}\nSố tiền: {amount_vnd} VND\nPhương thức: {payment_method}\n\nChúng tôi sẽ thông báo khi thanh toán được xác nhận.\nXem hóa đơn: {invoice_url} | Hi {member_name},\n\nWe have received your payment request.\n\nProduct: {product_name}\nAmount: {amount_vnd} VND\nMethod: {payment_method}\n\nWe will notify you when payment is confirmed.\nView invoice: {invoice_url} |

---

### `payment_pending`

**Variables**: `{member_name}`, `{product_name}`, `{amount_vnd}`, `{payment_method}`, `{expected_completion}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Thanh toán đang chờ xử lý — {product_name} | Payment pending — {product_name} |
| **Body** | Xin chào {member_name},\n\nThanh toán của bạn đang được xử lý và cần thêm thời gian.\n\nSản phẩm: {product_name}\nSố tiền: {amount_vnd} VND\nDự kiến hoàn thành: {expected_completion}\n\nChúng tôi sẽ thông báo ngay khi có kết quả. | Hi {member_name},\n\nYour payment is being processed and needs additional time.\n\nProduct: {product_name}\nAmount: {amount_vnd} VND\nExpected completion: {expected_completion}\n\nWe will notify you as soon as it clears. |

---

### `payment_success`

**Variables**: `{member_name}`, `{product_name}`, `{amount_vnd}`, `{payment_method}`, `{transaction_id}`, `{invoice_url}`, `{dashboard_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Thanh toán thành công — {product_name} | Payment successful — {product_name} |
| **Body** | Xin chào {member_name},\n\nThanh toán của bạn đã được xác nhận.\n\nSản phẩm: {product_name}\nSố tiền: {amount_vnd} VND\nPhương thức: {payment_method}\nMã giao dịch: {transaction_id}\n\nXem hóa đơn: {invoice_url}\nVào trang của bạn: {dashboard_url} | Hi {member_name},\n\nYour payment has been confirmed.\n\nProduct: {product_name}\nAmount: {amount_vnd} VND\nMethod: {payment_method}\nTransaction ID: {transaction_id}\n\nView invoice: {invoice_url}\nGo to your dashboard: {dashboard_url} |

---

### `payment_failed`

**Variables**: `{member_name}`, `{product_name}`, `{amount_vnd}`, `{failure_reason}`, `{retry_url}`, `{support_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Thanh toán thất bại — {product_name} | Payment failed — {product_name} |
| **Body** | Xin chào {member_name},\n\nRất tiếc, thanh toán của bạn không thành công.\n\nSản phẩm: {product_name}\nSố tiền: {amount_vnd} VND\nLý do: {failure_reason}\n\nThử lại: {retry_url}\nCần hỗ trợ: {support_url} | Hi {member_name},\n\nUnfortunately, your payment was unsuccessful.\n\nProduct: {product_name}\nAmount: {amount_vnd} VND\nReason: {failure_reason}\n\nTry again: {retry_url}\nNeed help: {support_url} |

---

### `refund_initiated`

**Variables**: `{member_name}`, `{product_name}`, `{refund_amount_vnd}`, `{expected_days}`, `{transaction_id}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Hoàn tiền đang được xử lý — {product_name} | Refund initiated — {product_name} |
| **Body** | Xin chào {member_name},\n\nYêu cầu hoàn tiền của bạn đã được xử lý.\n\nSản phẩm: {product_name}\nSố tiền hoàn: {refund_amount_vnd} VND\nMã giao dịch gốc: {transaction_id}\nDự kiến nhận tiền: {expected_days} ngày làm việc | Hi {member_name},\n\nYour refund has been initiated.\n\nProduct: {product_name}\nRefund amount: {refund_amount_vnd} VND\nOriginal transaction: {transaction_id}\nExpected to arrive: {expected_days} business days |

---

### `refund_completed`

**Variables**: `{member_name}`, `{product_name}`, `{refund_amount_vnd}`, `{transaction_id}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Hoàn tiền hoàn thành — {product_name} | Refund completed — {product_name} |
| **Body** | Xin chào {member_name},\n\nTiền hoàn đã được gửi về tài khoản của bạn.\n\nSản phẩm: {product_name}\nSố tiền hoàn: {refund_amount_vnd} VND\nMã giao dịch: {transaction_id} | Hi {member_name},\n\nYour refund has been sent back to your account.\n\nProduct: {product_name}\nRefund amount: {refund_amount_vnd} VND\nTransaction ID: {transaction_id} |

---

### `invoice_receipt`

**Variables**: `{member_name}`, `{invoice_id}`, `{product_name}`, `{amount_vnd}`, `{payment_method}`, `{payment_date}`, `{invoice_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Hóa đơn #{invoice_id} — Về Tương Lai | Invoice #{invoice_id} — Về Tương Lai |
| **Body** | Xin chào {member_name},\n\nĐây là hóa đơn cho giao dịch của bạn.\n\nSản phẩm: {product_name}\nSố tiền: {amount_vnd} VND\nPhương thức: {payment_method}\nNgày thanh toán: {payment_date}\nMã hóa đơn: {invoice_id}\n\nXem hóa đơn đầy đủ: {invoice_url} | Hi {member_name},\n\nHere is the receipt for your transaction.\n\nProduct: {product_name}\nAmount: {amount_vnd} VND\nMethod: {payment_method}\nPayment date: {payment_date}\nInvoice ID: {invoice_id}\n\nView full invoice: {invoice_url} |

---

### `payment_unlock_magic_link`

**Variables**: `{member_name}`, `{magic_link_url}`, `{product_name}`, `{expiry_minutes}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Kích hoạt quyền truy cập — {product_name} | Activate your access — {product_name} |
| **Body** | Xin chào {member_name},\n\nThanh toán của bạn đã được xác nhận. Bấm vào liên kết để kích hoạt và truy cập {product_name}.\n\n{magic_link_url}\n\nLinh kết hết hạn sau {expiry_minutes} phút. | Hi {member_name},\n\nYour payment has been confirmed. Click the link to activate and access {product_name}.\n\n{magic_link_url}\n\nLink expires in {expiry_minutes} minutes. |

---

## Group 3 — Wallet (5 templates)

### `wallet_credited` *(existing in KV)*

**Variables**: `{member_name}`, `{amount_vnd}`, `{new_balance_vnd}`, `{source_description}`, `{dashboard_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Ví đã được nạp {amount_vnd} VND | Wallet credited {amount_vnd} VND |
| **Body** | Xin chào {member_name},\n\nVí của bạn vừa được nạp {amount_vnd} VND.\n\nNguồn: {source_description}\nSố dư hiện tại: {new_balance_vnd} VND\n\nXem ví: {dashboard_url} | Hi {member_name},\n\nYour wallet has been credited {amount_vnd} VND.\n\nSource: {source_description}\nNew balance: {new_balance_vnd} VND\n\nView wallet: {dashboard_url} |

---

### `wallet_debit`

**Variables**: `{member_name}`, `{amount_vnd}`, `{new_balance_vnd}`, `{reason}`, `{dashboard_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Ví đã bị trừ {amount_vnd} VND | Wallet debited {amount_vnd} VND |
| **Body** | Xin chào {member_name},\n\nVí của bạn vừa bị trừ {amount_vnd} VND.\n\nLý do: {reason}\nSố dư hiện tại: {new_balance_vnd} VND\n\nXem ví: {dashboard_url} | Hi {member_name},\n\nYour wallet has been debited {amount_vnd} VND.\n\nReason: {reason}\nNew balance: {new_balance_vnd} VND\n\nView wallet: {dashboard_url} |

---

### `withdrawal_requested`

**Variables**: `{member_name}`, `{amount_vnd}`, `{bank_name}`, `{account_last4}`, `{expected_days}`, `{request_id}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Yêu cầu rút tiền đã nhận — {amount_vnd} VND | Withdrawal request received — {amount_vnd} VND |
| **Body** | Xin chào {member_name},\n\nYêu cầu rút tiền của bạn đã được ghi nhận.\n\nSố tiền: {amount_vnd} VND\nNgân hàng: {bank_name} ****{account_last4}\nDự kiến: {expected_days} ngày làm việc\nMã yêu cầu: {request_id} | Hi {member_name},\n\nYour withdrawal request has been received.\n\nAmount: {amount_vnd} VND\nBank: {bank_name} ****{account_last4}\nExpected: {expected_days} business days\nRequest ID: {request_id} |

---

### `withdrawal_completed`

**Variables**: `{member_name}`, `{amount_vnd}`, `{bank_name}`, `{account_last4}`, `{transaction_id}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Rút tiền hoàn thành — {amount_vnd} VND | Withdrawal completed — {amount_vnd} VND |
| **Body** | Xin chào {member_name},\n\nTiền đã được chuyển thành công.\n\nSố tiền: {amount_vnd} VND\nNgân hàng: {bank_name} ****{account_last4}\nMã giao dịch: {transaction_id} | Hi {member_name},\n\nYour funds have been transferred successfully.\n\nAmount: {amount_vnd} VND\nBank: {bank_name} ****{account_last4}\nTransaction ID: {transaction_id} |

---

### `withdrawal_failed`

**Variables**: `{member_name}`, `{amount_vnd}`, `{failure_reason}`, `{refunded_amount_vnd}`, `{support_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Rút tiền thất bại — {amount_vnd} VND | Withdrawal failed — {amount_vnd} VND |
| **Body** | Xin chào {member_name},\n\nRút tiền của bạn không thành công.\n\nSố tiền: {amount_vnd} VND\nLý do: {failure_reason}\n\nSố tiền {refunded_amount_vnd} VND đã được hoàn lại vào ví.\nCần hỗ trợ: {support_url} | Hi {member_name},\n\nYour withdrawal was unsuccessful.\n\nAmount: {amount_vnd} VND\nReason: {failure_reason}\n\n{refunded_amount_vnd} VND has been returned to your wallet.\nNeed help: {support_url} |

---

## Group 4 — KYC (5 templates)

### `kyc_started`

**Variables**: `{member_name}`, `{kyc_portal_url}`, `{expected_days}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Xác minh danh tính đã bắt đầu | KYC verification started |
| **Body** | Xin chào {member_name},\n\nChúng tôi đã nhận được yêu cầu xác minh danh tính của bạn.\n\nBạn có thể kiểm tra tiến độ tại: {kyc_portal_url}\nDự kiến hoàn thành: {expected_days} ngày làm việc | Hi {member_name},\n\nWe have received your identity verification request.\n\nYou can track progress at: {kyc_portal_url}\nExpected completion: {expected_days} business days |

---

### `kyc_pending_review`

**Variables**: `{member_name}`, `{kyc_portal_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Hồ sơ KYC đang được xem xét | KYC documents under review |
| **Body** | Xin chào {member_name},\n\nHồ sơ xác minh danh tính của bạn đang được đội ngũ xem xét. Chúng tôi sẽ thông báo trong vòng 1–2 ngày làm việc.\n\nXem trạng thái: {kyc_portal_url} | Hi {member_name},\n\nYour identity documents are under review by our team. We will notify you within 1–2 business days.\n\nCheck status: {kyc_portal_url} |

---

### `kyc_approved`

**Variables**: `{member_name}`, `{approved_level}`, `{dashboard_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Xác minh danh tính thành công | KYC approved |
| **Body** | Xin chào {member_name},\n\nDanh tính của bạn đã được xác minh thành công (cấp độ: {approved_level}).\n\nCác tính năng nâng cao đã được mở khóa. Vào trang của bạn: {dashboard_url} | Hi {member_name},\n\nYour identity has been successfully verified (level: {approved_level}).\n\nAdvanced features have been unlocked. Go to your dashboard: {dashboard_url} |

---

### `kyc_rejected`

**Variables**: `{member_name}`, `{rejection_reason}`, `{resubmit_url}`, `{support_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Xác minh danh tính không thành công | KYC rejected |
| **Body** | Xin chào {member_name},\n\nRất tiếc, hồ sơ xác minh của bạn chưa đáp ứng yêu cầu.\n\nLý do: {rejection_reason}\n\nBạn có thể nộp lại tại: {resubmit_url}\nCần hỗ trợ: {support_url} | Hi {member_name},\n\nUnfortunately, your verification documents did not meet our requirements.\n\nReason: {rejection_reason}\n\nYou may resubmit at: {resubmit_url}\nNeed help: {support_url} |

---

### `kyc_more_info`

**Variables**: `{member_name}`, `{info_required}`, `{upload_url}`, `{deadline}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Cần thêm thông tin cho xác minh danh tính | Additional information required for KYC |
| **Body** | Xin chào {member_name},\n\nChúng tôi cần thêm thông tin để hoàn tất xác minh.\n\nThông tin cần bổ sung: {info_required}\n\nNộp tại: {upload_url}\nHạn chót: {deadline} | Hi {member_name},\n\nWe need additional information to complete your verification.\n\nRequired: {info_required}\n\nSubmit at: {upload_url}\nDeadline: {deadline} |

---

## Group 5 — Social (2 templates, existing in KV)

### `job_application_received` *(existing in KV)*

**Variables**: `{member_name}`, `{job_title}`, `{company_name}`, `{application_id}`, `{status_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | Đã nhận đơn ứng tuyển — {job_title} | Application received — {job_title} |
| **Body** | Xin chào {member_name},\n\nChúng tôi đã nhận được đơn ứng tuyển của bạn cho vị trí {job_title} tại {company_name}.\n\nMã đơn: {application_id}\nTheo dõi trạng thái: {status_url} | Hi {member_name},\n\nWe have received your application for {job_title} at {company_name}.\n\nApplication ID: {application_id}\nTrack status: {status_url} |

---

### `community_reply` *(existing in KV)*

**Variables**: `{member_name}`, `{replier_name}`, `{post_title}`, `{reply_preview}`, `{post_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | {replier_name} vừa trả lời bạn | {replier_name} replied to you |
| **Body** | Xin chào {member_name},\n\n{replier_name} đã trả lời bài viết "{post_title}" của bạn:\n\n"{reply_preview}"\n\nXem toàn bộ: {post_url} | Hi {member_name},\n\n{replier_name} replied to your post "{post_title}":\n\n"{reply_preview}"\n\nSee the full thread: {post_url} |

---

## Group 6 — Generic (1 template, existing in KV)

### `generic` *(existing in KV)*

**Variables**: `{member_name}`, `{subject_line}`, `{body_text}`, `{cta_label}`, `{cta_url}`

| | Vietnamese | English |
|---|---|---|
| **Subject** | {subject_line} | {subject_line} |
| **Body** | Xin chào {member_name},\n\n{body_text}\n\n{cta_label}: {cta_url} | Hi {member_name},\n\n{body_text}\n\n{cta_label}: {cta_url} |

---

## Standard footer (appended to every template)

**Vietnamese:**
```
---
Bạn nhận được email này vì là thành viên của Về Tương Lai.
Để hủy đăng ký thông báo không bắt buộc, vào: {unsubscribe_url}
Về Tương Lai · vetuonglai.com
```

**English:**
```
---
You received this email because you are a member of Về Tương Lai.
To unsubscribe from non-essential notifications, visit: {unsubscribe_url}
Về Tương Lai · vetuonglai.com
```

---

## Implementation notes

- **HTML-escape all variables** before injection. Never trust `{member_name}`, `{product_name}`, `{failure_reason}`, or any other user-supplied value.
- **`amount_vnd` format**: always pre-format as `1,234,567` (comma thousands separator, no decimal) before passing to template. Do not format inside the template renderer.
- **Missing variable fallback**: if a variable is not provided, render as empty string — never render the `{variable_name}` placeholder in production output.
- **Language selection**: read `Accept-Language` header or member profile `lang` field (`vi` default). Fall back to `vi` if unknown.
- **From address**: `noreply@vetuonglai.com` (pending Q.B1 confirmation).
- **BCC**: `audit@vetuonglai.com` (pending Q.B2 confirmation).
- **Delivery layer**: Resend API when `RESEND_API_KEY` present; otherwise KV inbox only (no outbound delivery degradation).

---

*Generated by autonomous dev agent · vetuonglai-system · 2026-05-21*
