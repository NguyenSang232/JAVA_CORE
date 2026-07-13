# NOTES — JavaWebExam_ntsang
Học viên: Nguyễn Thanh Sáng
Ngày bắt đầu: 13/07/2026
Branch: `java-web/exam`
---
## 1. Nhật ký hàng ngày
> Bắt buộc cập nhật mỗi ngày làm việc trước khi commit (theo yêu cầu đề bài).          
### Day 1 — 13/07/2026
- **Đã làm:** 
+ Tìm hiểu về thiết kế dữ liệu, xem luồng hoạt động của dữ liệu và giao diện mẫu.
+ Viết các file entity và response, mapper.xml
+ Thực hiện đăng nhập có tích hợp security.
+ Test được một phần chức năng thêm mới (A1)
+ Chưa tích hợp exception
- **Khó khăn:** Ở mỗi API sẽ có dữ liệu từ request từ người dùng. Vấn đề còn đang bâng khuâng là: Ở mỗi Request từ người dùng có nên viết một DTO request và DTO response cho từng API hay không. có thể tái dụng những lại những DTO có sẵn hay không ạ?
- **Cách giải quyết:** Hiện tại em vẫn chỉ dùng một DTO cho đa số method chứ chưa có tách riêng cho từng API
- **Commit:** `[Day 1] ...`
- **Ref mục Quyết định thiết kế (nếu có):** 
## 2. Quyết định thiết kế (các phần đề không đặc tả đầy đủ)
> Schema và quyết định cách làm.
> Miễn là **nhất quán** và **giải thích được lý do** ở đây.
Thiết kế cơ sơ dữ liệu gồm 5 bảng: owners, pets, boarding_records, users, care_notes
### 2.1 [Vấn đề]
- **Vấn đề:** Ở một số bảng còn thiếu một số thông tin, chưa thể hiện được rõ ràng thời của từng bảng ghi. Ví dụ ở bảng Pets không có thời gian cập nhật mới nhất nên không thể nắm được thời mới nhất khi thay đổi. 
- **Quyết định của tôi:** Thêm vào bảng Pets trường updated_at, Bảng owner thêm trường updated_at và deleted_at, bảng boarding_records thêm trường updated_at.
- **Lý do chọn:**
+ Bảng pets: Trọng lượng và tuổi của thú nuôi sẽ thay đổi nên cần thời gian cập nhật để biết đúng nhất thông tin của thời điểm hiện tại.
+ Bảng users: Hiện tại chưa có thay đổi nhưng nếu làm thêm chức năng thay đổi mật khẩu hoạt là thay đổi thông tin đăng nhập thì sẽ thêm cột update_at.
Thêm chức năng xóa nếu xóa cứng thì sẽ mất thông tin ở các bảng ghi khác, còn xóa mềm thì giả sử như cái sdt đăng ký đó không sử dụng nữa + sdt là unique theo thiết kế thì không thể đăng ký mới nếu số điện thoại giống nhau
+ Bảng owner: Người dùng có thể thay đổi tên, địa chỉ nên cần thêm cột updated_at, thêm cột deleted_at để lấy được khách hiện tại còn hoạt động của shop để làm thống kê.
+ Bảng boarding_records: Vì theo giao diện mẫu lúc tạo chi tiết phiếu gửi có để trống chỗ "Thời gian trả thực tế" nên cần thêm cột updated_at để lấy thống kê và hiển thị được thông tin chính xác nhất.
- **Thay đổi schema (nếu có):** 
+ pets: thêm updated_at.
+ owner: thêm updated_at, deleted_at.
+ boarding_records: thêm updated_at.
+ users: có thể sẽ thêm updated_at, delete_at.
### 2.2 [Vấn đề]
## 3. Ghi chú kỹ thuật khác
- Điểm chưa hoàn thành hoặc biết còn lỗi (nếu deadline không đủ thời gian).