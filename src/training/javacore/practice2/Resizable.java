package training.javacore.practice2;

//Exercise 4 - m
// Ellipse không nên implements vì phụ thuộc vào 2 yếu tố độ dài nếu thay đổi thì nó sẽ mất đi tính chất
// ban đầu của nó
// Rectangle --> // chỉ thay đổi chiều rồng và chiều dài nên có thể thực hiện được, hình không bị
// biến dạng khi thay đổi
// Circle --> 
// Vì hình tròn chỉ có bán kính nên có thể dễ dàng refactor, nó sẽ to nhỏ tùy
// theo giá trị r --> có thể implements được
// Tại sao lại tạo đối tượng mới:
// Tránh sửa dữ liệu của đối tượng cũ, nếu mà đối tượng đó đang được sử dụng thì sẽ ảnh hưởng đến nhiều phần khác
// Khi tạo mới mà nó không đúng logic thì vẫn còn cái cũ để dự phòng.
public interface Resizable {
	Shape resize(double factor);
}
