# LOCAL_DEV_EXECUTION_PROTOCOL_2026

## Trạng thái

- status: active_internal_only
- owner: Codex local execution lane
- last_updated: 2026-04-19

## Mục đích

Đây là protocol nội bộ, chỉ dùng cho lane làm việc cục bộ trong repo hiện tại.

File này không phải:

- protocol govern cho toàn bộ team `vetuonglai.com`
- source of truth cho planning, release, hay governance của hệ

File này chỉ giúp Codex và lane nội bộ:

- làm việc có thứ tự
- không tự mở scope
- báo cáo rõ phần đã sửa
- tránh làm lẫn giữa “tài liệu nội bộ” và “tài liệu govern của dự án”

## Nguyên tắc nội bộ

1. Đọc phạm vi trước khi sửa.
2. Không áp một rule mới sang toàn hệ nếu user chưa khóa phạm vi rõ.
3. Khi đụng tài liệu govern, ưu tiên correction rõ ràng hơn là suy diễn.
4. Mọi thay đổi phải để lại dấu vết trong file liên quan.
5. Nếu một file có nguy cơ gây hiểu nhầm về phạm vi áp dụng, phải ghi correction ngay trong file đó.

## Quy trình cục bộ

1. Xác nhận phạm vi user vừa khóa.
2. Rà các file đang viện dẫn sai phạm vi đó.
3. Gỡ hoặc thu hẹp các tham chiếu gây hiểu nhầm.
4. Cập nhật file correction hoặc deprecation khi cần.
5. Báo cáo lại ngắn gọn: đã đổi gì, còn gì chưa đổi.

## Điều không được làm

- không coi tài liệu nội bộ là rule bắt buộc cho team dự án
- không thêm protocol nội bộ vào master handoff index của dự án
- không ghi vào sync report của dự án rằng toàn team đã bị ràng buộc bởi protocol này, trừ khi user chốt riêng việc đó
