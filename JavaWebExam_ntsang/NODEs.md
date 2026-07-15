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
- **Commit:** `[a77d83f]`
- **Ref mục Quyết định thiết kế (nếu có):** 

### Day 2 — 14/07/2026
- **Đã làm:** 
Đã thiết kế và triển khai các API
- Ở nhóm chức năng owner - chủ nuôi
+ Tạo mới chủ nuôi
+ Lấy thông tin tất cả chủ nuôi
+ Tìm chủ nuôi theo id.
+ Cập nhật thông tin chủ nuôi
+ Tìm chủ nuôi theo tên hoặc số điện thoại
- Ở nhóm chức năng pets - thú cưng
+ Thêm mới thú cưng
+ Lấy tất cả thú cưng
+ Lấy thông tin chi tiết thú cưng
+ Cập nhật thông tin thú cưng
+ Xóa thú cưng
+ Tìm theo loại 
+ Tìm theo thông tin chủ nuôi
+ Tìm thú cưng theo người dùng hiện tại
- Ở nhóm chức năng users - người dùng tài khoản
+ Thêm mới người dùng
+ Xóa người dùng
- Hoàn thành file exception để xử lý exception.
- **Khó khăn:** Ở bảng boarding_records hiện tại chỉ có một cột base_fee chỉ là tổng tiền sau cho lần gửi như chưa có price_per_date để có thể dễ dang tính toán hơm.
Hiện tại chưa có cột expected_day để xác định được ngày trả dự kiến khiến cho chưa có căn tính đế biết tại sao nó trễ và trễ bao nhiêu ngày.
- **Cách giải quyết:** Thêm trường price_per_day + expected_day vào bảng boarding _record để có thể dễ dàng tính toán hơn
 Ở chỗ tiền cho từng ngày thì sẽ chia thanh từng nhóm như là Cat: 100.000/ngày, Dog: 150.000/ngày, Bird: 60.000/ngày
- **Commit:** `[e3e349d]`
- **Ref mục Quyết định thiết kế (nếu có):** 

### Day 3 — 15/07/2026
- **Đã làm:** 
- Ở nhóm chức năng BoardingRecords
+ C1 Tạo mới phiếu gửi
+ C2 Hiển thị tất cả phiếu gửi
+ C3 Xem chi tiết
+ C4 Trả thú nuôi
+ C5 Danh sách thú nuôi theo trạng thái đang gửi
+ C6 Lịch sử gửi theo thú cưng
+ C7 Lịch sử gửi theo chủ nuôi
+ C8 Tìm phiếu gửi theo thời gian
+ C9 Phiếu đang gửi của tôi
+ C10 Lịch sử gửi của tôi theo mới nhất
+ D1 Thêm ghi chú chăm sóc vào phiếu gửi
+ D2 Xem danh sách ghi chú của một phiếu gửi
- **Khó khăn:** Vấn đề về giá gửi cho từng loại thú cưng cho từng ngày hiện tại vẫn chưa chắc chắn.
- **Cách giải quyết:** Ban đầu sẽ tạo Entity giá cho từng nhóm động vật (hiện tại vẫn chưa chốt vì vẫn còn chạy thử dữ liệu trên swagger
**Commit:** `[Day 3] ...`

## 2. Quyết định thiết kế (các phần đề không đặc tả đầy đủ)
> Schema và quyết định cách làm.
> Miễn là **nhất quán** và **giải thích được lý do** ở đây.
Thiết kế cơ sơ dữ liệu gồm 5 bảng: owners, pets, boarding_records, users, care_notes
### 2.1 [Vấn đề]
- **Vấn đề:** Ở một số bảng còn thiếu một số thông tin, chưa thể hiện được rõ ràng thời gian của từng bảng ghi. Ví dụ ở bảng Pets không có thời gian cập nhật mới nhất nên không thể nắm được thời mới nhất khi thay đổi. Thêm trường deleted_at để có thể dễ dàng nắm thống kê
- **Quyết định của tôi:** Thêm vào bảng Pets trường updated_at + deleted_at, Bảng owner thêm trường updated_at và deleted_at, bảng boarding_records thêm trường updated_at.
- **Lý do chọn:**
+ Bảng pets: Trọng lượng và tuổi của thú nuôi sẽ thay đổi nên cần thời gian cập nhật để biết đúng nhất thông tin của thời điểm hiện tại. xóa mềm để có thể xem lịch sử cũng như là thống kê.
+ Bảng users: Hiện tại chưa có thay đổi nhưng nếu làm thêm chức năng thay đổi mật khẩu hoạt là thay đổi thông tin đăng nhập thì sẽ thêm cột update_at.
Thêm chức năng xóa nếu xóa cứng thì sẽ mất thông tin ở các bảng ghi khác, còn xóa mềm thì giả sử như cái sdt đăng ký đó không sử dụng nữa + sdt là unique theo thiết kế thì không thể đăng ký mới nếu số điện thoại giống nhau
+ Bảng owner: Người dùng có thể thay đổi tên, địa chỉ nên cần thêm cột updated_at, thêm cột deleted_at để lấy được khách hiện tại còn hoạt động của shop để làm thống kê.
+ Bảng boarding_records: Vì theo giao diện mẫu lúc tạo chi tiết phiếu gửi có để trống chỗ "Thời gian trả thực tế" nên cần thêm cột updated_at để lấy thống kê và hiển thị được thông tin chính xác nhất.
- **Thay đổi schema (nếu có):** 
+ pets: thêm updated_at, deleted_at
+ owner: thêm updated_at, deleted_at.
+ boarding_records: thêm updated_at, price_per_day, expected_return;
+ users: có thể sẽ thêm updated_at, delete_at.
## 3. Ghi chú kỹ thuật khác
- Điểm chưa hoàn thành hoặc biết còn lỗi (nếu deadline không đủ thời gian).