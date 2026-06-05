package training.javacore.practice2;

import java.time.LocalDate;

//shape --> Shape
//Abstract --> abstract
//??? [A] Tại sao class Shape là abstract?
// Vì class Shape sẽ mang nhưng thông tin chung nên dùng abstract để có thể tái sử dụng code
public abstract class Shape {
	// Color -> color
	protected Color color;
	// Border_Width --> borderWidth
	protected double borderWidth;

	protected double x;

	protected double y;
	// Exercise 4 - k
	private LocalDate createdAt;

	public Shape(Color color, double borderWidth, double x, double y, LocalDate createdAt) {
		this.color = color;
		this.borderWidth = borderWidth;
		this.x = x;
		this.y = y;
		this.createdAt = createdAt;
	}

	// Return the name of the shape
	// GetName() --> getName()
	public abstract String getName();

	// Calculate the area of the shape
	// CalcArea() --> calcArea()
	public abstract double calcArea(); // ??? [B] Tại sao CalcArea() là abstract nhưng calcDistance() thì không?
	// Vì mỗi hình sẽ có một công thức tính diện tích riêng nên cần phải class con
	// tự định nghĩa
	// Tính khoảng cách thì nó dùng chung công thức nên định nghĩa chung
	// Calculate the distance from the shape to 0(0,0)

	public double calcDistance() {
		return Math.sqrt(x * x + y * y);
	} // ??? [C] Tại sao calcDistance() dùng x và y của shape thay vì nhận tham số tọa
		// độ?
		// Vì mỗi object ví dụ như là Circle(5,"Red",1.0, 3, 4) đã có thông tin tọa độ
		// hết ròi nên không cần phải
		// Dùng getX() hoặc getY() sẽ không còn tốt nữa

	public Color getColor() {
		return color;
	}

	public double getBorderWidth() {
		return borderWidth;
	}

	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	// Exercise 4 - L
	// Hàm toString() ở lớp cha Shape đã tự động gọi các phương thức đa hình là
	// calcArea() và calcDistance().
	// Khi Circle hay Rectangle gọi toString(), nó sẽ tự tìm đến đúng hàm tính diện
	// tích/khoảng cách của riêng hình đó để in ra.
	// --> cơ bản đã đầy đủ thông tin rồi.
	// Có thể override ở rectangle và ellipse như muốn hiển thi thông tin về width và height cũng như là bên ellipse
	@Override
	public String toString() {
		return String.format("[%s] color=%s | area=%.2f | distance=%.2f", getName(),
				color != null ? color.name() : "None", calcArea(), calcDistance());
	}
}