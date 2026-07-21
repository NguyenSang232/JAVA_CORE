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
**Commit:** `[29a9621]`
### Day 4 — 16/07/2026
- **Đã làm:** 
- Thực hiện cơ bản giao diện thống kê:
+ Giao diện quản lý chung (tổng số người dùng, biểu đồ thống kê).
+ Giao diện quản lý Chủ nuôi, Thú nuôi.
+ Kết hợp các API thực hiện tương tác với giao diện trong phần Pets.
+ Các phần như Owner, CareNote, BorardingRecord đã viết các giao diện và gọi API nhưng chưa chạy hết các trường hợp, chưa validation các trường dữ liệu khi
thực hiện các thao tác.
+ Tách file .js ra thành nhiều file nhỏ ở tương ứng với mỗi màn hình để dễ dàng quản lý cũng như chỉnh sửa sau này.
- **Khó khăn:** Các chức năng sắp xếp, lọc hiện tại chỉ load dữ liệu một lần ròi thực hiện trên đó chưa có lấy dữ liệu trực tiếp từ API
- **Cách giải quyết:** Ngày mai sẽ tiếp tục thực hiện hoàn chỉnh các chức năng, Thực hiện sắp xếp, tìm kiếm dựa trên dữ liệu từ API.
+ Tiếp tục hoàn chỉnh giao diện.
**Commit:** `[a21bd43]`

### Day 5 — 17/07/2026
- **Đã làm:** 
- Thực hiện cơ bản giao diện thống kê:
+ Update Giao diện quản lý chung (tổng số người dùng, biểu đồ thống kê).
+ Update Giao diện quản lý Chủ nuôi, Thú nuôi.
+ Kết hợp các API thực hiện tương tác với giao diện trong phần Pets và Owner.
+ Kết hợp khoảng 60% các API đã viết kết hợp với giao diện.
- **Khó khăn:** Chưa phân quyền cho role ADMIN, hiện tại đang permitAll().
- **Cách giải quyết:** Sẽ tạo một bảng đơn giá cho từng loại vật dựa trên giá trả đúng hạn của data sample mẫu. 
Chỗ dữ liệu mẫu em thấy cho một comment là no discount ==> có thể sẽ thêm trường tích điểm cho owners. Ví dụ nếu số tiền tích lũy trên 3tr thì sẽ giảm 3%,
5tr là 5% và trên 10tr là sẽ 10%.
**Commit:** `[Day5]`

### Day 6 — 21/07/2026

- **Đã làm:**
- Thực hiện cơ bản giao diện thống kê:
* Update giao diện quản lý Owner, Pets, Boarding.
* Thực hiện thêm entity price cho từng loại động vật
* Thực hiện được một phần giao diện của User
* Cập nhật file SecurityConfig để phân quyền cho người dùng có ROLE_CUSTOMER và ADMIN
* Thực hiện các API để admin có thể quản lý giá dễ dàng

- **Khó khăn:** Thay đổi cách tính giá mới. Hiện tại do gọi API mỗi lần thao tác nên giao diện hiển thị còn phải chờ hệ thống load thông tin từ backend
- **Cách giải quyết:** Đã tạo bảng giá cho từng loại động vật để có thể linh động trong việc cập nhật giá
  **Commit:** `[Day6]`

## 2. Quyết định thiết kế (các phần đề không đặc tả đầy đủ)

> Schema và quyết định cách làm.
> Miễn là **nhất quán** và **giải thích được lý do** ở đây.
Thiết kế cơ sơ dữ liệu gồm 5 bảng: owners, pets, boarding_records, users, care_notes

### 2.1 Thiết kế database chung 

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
+ owner: thêm updated_at, deleted_at. (dự định sẽ thêm cột customer_money)
+ boarding_records: thêm updated_at, price_per_day, expected_return;
+ users: có thể sẽ thêm updated_at, delete_at.
+ price: quan hệ 1 - 1 với bảng pets
+ Cập nhật thêm bảng Price: Sẽ chia ra tùy theo cân nặng của pet, Ví dụ 0 -> 10kg là 100.000, 10.1 - 30kg sẽ là 180000. Trên giao diện sẽ tự động tính giá theo Type và Weight của Pet

### 2.2 Bảng Pets chi tiết

- **Vấn đề:** Chưa có thời gian cập nhật cho thú cưng, xóa cứng hay xóa mềm cho thú cưng. Lí do vì thể trạng của thú cưng có thể thay đổi theo thời gian, xóa cứng hay xóa mềm trong trường hợp k còn quản lý thú cưng đó nữa
- **Quyết định của tôi:** Thêm vào bảng Pets trường updated_at + deleted_at, thực hiện xóa mềm.
- **Lý do chọn:** Để người quản lý có thể dễ dàng biết được thông tin thú cưng như thế nào, Có thể áp dụng mức giá phù hợp theo thiết kế bảng Price. Xóa mềm vì phục vụ cho chức năng thống kê và xem lịch sử gửi đối với vai trò người dùng.

### 2.3 Bảng Boarding_records
 
 - **Vấn đề:** Theo đề cần các trường như giá theo ngày, ngày thực tế trả pet nhưng thực tế database chưa có các bản này
- **Quyết định của tôi:** thêm vào trường expected_return, price_per_day.
- **Lý do chọn:** để được chính xác ngày trả, giá trên để tính theo ngày nhưng database hiện tại chưa có trường này 
## 3. Ghi chú kỹ thuật khác
- Điểm chưa hoàn thành hoặc biết còn lỗi (nếu deadline không đủ thời gian).