# PHỐ HANDMADE AI OS 4.1 MOBILE

Hệ thống quản lý tĩnh, tối ưu cho điện thoại và có thể chạy miễn phí trên Netlify.

## Chức năng đã có

- Dashboard tổng quan và gợi ý chuyên gia.
- Lịch nội dung 7 ngày, lọc theo kênh, đánh dấu hoàn thành.
- AI Content Studio với hai chế độ:
  - Bản miễn phí dùng mẫu dựng sẵn.
  - Bản AI gọi OpenAI qua Netlify Function.
- KPI Center, biểu đồ tăng trưởng và tương tác.
- Thư viện bài viết, prompt, ý tưởng và liên kết.
- Xuất KPI CSV, in báo cáo PDF, sao lưu/khôi phục JSON.
- Dữ liệu lưu bằng LocalStorage trên thiết bị, không cần cơ sở dữ liệu.

## Đưa lên GitHub và Netlify

1. Giải nén thư mục.
2. Tạo Repository GitHub mới.
3. Tải toàn bộ file trong thư mục này lên Repository.
4. Trong Netlify chọn **Add new project → Import an existing project**.
5. Chọn Repository vừa tải lên.
6. Build command: để trống.
7. Publish directory: `.`
8. Deploy.

## Bật AI tùy chọn

Trong Netlify:

1. Mở **Project configuration → Environment variables**.
2. Thêm:
   - `OPENAI_API_KEY` = khóa API của bạn.
   - `OPENAI_MODEL` = model bạn muốn dùng, ví dụ `gpt-5-mini`.
3. Redeploy website.

Khóa API chỉ nằm trên máy chủ Netlify, không xuất hiện trong mã trình duyệt.

## Chi phí

- GitHub: có thể dùng miễn phí.
- Netlify: có thể dùng gói miễn phí cho giai đoạn đầu.
- Dashboard, lịch, KPI, thư viện: không dùng AI nên không phát sinh phí.
- Chỉ nút **Tạo bằng AI** mới gọi API và phát sinh chi phí theo mức sử dụng.
- Nút **Tạo bản miễn phí** hoạt động không cần API.

## Lưu ý dữ liệu

Dữ liệu hiện lưu trên từng trình duyệt/điện thoại. Hãy bấm **Sao lưu** định kỳ để tải file JSON. Khi đổi thiết bị, vào mục Báo cáo và chọn file sao lưu để khôi phục.

## Cài trên điện thoại Android
1. Đưa phiên bản này lên GitHub và Netlify.
2. Mở website Netlify bằng Chrome trên điện thoại.
3. Nhấn nút **Cài ứng dụng** hoặc menu **⋮ → Cài đặt ứng dụng / Thêm vào màn hình chính**.
4. Chọn **Cài đặt**.
5. Ứng dụng sẽ xuất hiện trên màn hình chính và mở toàn màn hình.
