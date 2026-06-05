package training.javacore.practice2;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShapeManager {
	// Exercise 3a
	public void printAreas(List<Shape> shapes) {
		if (shapes == null || shapes.size() == 0) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		for (Shape shape : shapes) {
			System.out.println(shape.getName() + ": " + String.format("%.2f", shape.calcArea()));
		}
	}

	// Exercise 3b
	public void printDistances(List<Shape> shapes) {
		if (shapes == null || shapes.size() == 0) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		for (Shape shape : shapes) {
			System.out.println(shape.getName() + ": " + String.format("%.2f", shape.calcDistance()));
		}
	}

	// Exercise 3c
	// Exercise 4g
	// Chỗ này nên check null và rỗng ngay từ đầu để tránh lỗi
	// Không dùng return vì nó phải kiểm tra giá trị liên túc
	// để tránh lỗi sập chương trình (NullPointerException) khi xử lý dữ liệu phía
	// dưới.
	public void findLargestShape(List<Shape> shapes) {
		if (shapes == null || shapes.size() == 0) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		Shape maxAreas = shapes.get(0);
		double EPSILON = 0.0001;
		for (Shape shape : shapes) {
			if (shape.calcArea() > maxAreas.calcArea()) {
				maxAreas = shape;
			} else if (Math.abs(shape.calcArea() - maxAreas.calcArea()) < EPSILON) {
				if (shape.calcDistance() < maxAreas.calcDistance()) {
					maxAreas = shape;
				}
			}
		}
		System.out.println(maxAreas.getName() + ": " + String.format("%.2f", maxAreas.calcArea()));

	}
	
	// Exercise 3d
	public void countCircles(List<Shape> shapes) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		int count = 0;
		for (Shape shape : shapes) {
			if (shape.getName().equals("Circle")) {
				count++;
			}
		}
		if (count == 0) {
			System.out.println(" Circle not found");
		} else {
			System.out.println("Circle : " + count);
		}
	}
	// Exercise 4 - j
	// Update theo hướng là có thể đa dạng chuỗi đầu vào để kiểm tra
	// Ưu điểm: Đa dạng loại có thể kiểm tra số lượng, tái sử dụng
	// Nhược điểm: Người dùng đôi khi nhập không đúng tên hoàn toàn dẫn đến không
	// tìm thấy ( Cần truyền tham số)
	// Ưu điểm của cái cũ: Dễ hiểu, Nhược điểm chỉ dùng được cho Circle
	public void countCircles(List<Shape> shapes, String shapeName) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		int count = 0;
		for (Shape shape : shapes) {
			if (shape.getName().equals(shapeName)) {
				count++;
			}
		}
		if (count == 0) {
			System.out.println(shapeName + "not found");
		} else {
			System.out.println(shapeName + " : " + count);
		}
	}

	// Exercise 3e
	public void filterWithinRadius(List<Shape> shapes, double r) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		for (Shape shape : shapes) {
			if (shape.calcDistance() <= r) {
				System.out.println(shape.getName() + " : " + String.format("%.2f", shape.calcDistance()));
			}
		}
	}

	// Exercise 4-h
	public void filterWithinRadius(List<Shape> shapes, double r, boolean excludeBoundary) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		List<Shape> result = new ArrayList<>();
		for (Shape shape : shapes) {
			double distance = shape.calcDistance();
			if (excludeBoundary) {
				if (distance < r) {
					result.add(shape);
				}
			} else {
				if (distance <= r) {
					result.add(shape);
				}
			}
		}
		for (Shape shape : result) {
			System.out.println(shape.getName() + " : " + String.format("%.2f", shape.calcDistance()));
		}
	}

	// Add Thêm method mới
	public List<Shape> filterByShapeName(List<Shape> shapes, String categoryName) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		List<Shape> filteredList = new ArrayList<>();
		for (Shape shape : shapes) {
			if (shape.getName().equalsIgnoreCase(categoryName)) {
				filteredList.add(shape);
			}
		}
		return filteredList;
	}

	// Exercise 4-i
	// Phân tích các hàm của câu 3
	// countCircles() --> chỉ in ra dc số lượng của mỗi Circle nên không thể tái sử
	// dụng lại được.
	// filterWithinRadius() --> Chỉ ra nhưng hình thỏa yêu cầu về kích thước và so
	// sánh độ dài nên cũng không phù hợp
	// printAreas() --> Chỉ in ra thông tin tât cả shape không có thống kê , diện
	// tích nên cũng không phù hợp
	// findLargestShape --> Chỉ tìm hình chứ không ra theo đúng yếu nên loại
	// printDistances --> Chỉ ra khoảng tới tâm nên cũng loại trừ không sử dụng lai
	// --> Chỉ có thể sử dụng logic là sử lý dữ liệu như check null, empty
	// Tạo hàm mới để lọc theo tên và tái sử dụng phía dưới
	public void printShapeReport(List<Shape> shapes) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		String[] shapeCategory = { "Circle", "Ellipse", "Rectangle" };
		System.out.println("Shape " + "\t| Count" + "\t| Avg Area");
		for (int i = 0; i < shapeCategory.length; i++) {
			List<Shape> specificShapes = filterByShapeName(shapes, shapeCategory[i]);
			double avegareCircle = 0;
			int count = specificShapes.size();
			if (count == 0) {
				System.out.println(shapeCategory[i] + " \t| Not Found!");
			} else {
				double totalArea = 0;
				for (Shape shape : specificShapes) {
					totalArea += shape.calcArea();
				}
				System.out.println(shapeCategory[i] + " | " + count + " | " + String.format("%.2f", totalArea / count));
			}
		}
	}

	// Exercise 4 - k
	public void filterByDateRange(List<Shape> shapes, LocalDate startDate, LocalDate endDate) {
		if (shapes == null || shapes.isEmpty()) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		if (startDate == null || endDate == null) {
			throw new IllegalArgumentException("List cannot be null or empty!");
		}
		boolean found = false;
		for (Shape shape : shapes) {
			LocalDate date = shape.getCreatedAt();
			if (!date.isBefore(startDate) && !date.isAfter(endDate)) {
				System.out.println(shape.getName() + ": " + shape.getCreatedAt());
				found = true;
			}
		}
		if (!found) {
			System.out.println("Not found the shape!");
		}
	}

	public static void main(String[] args) {
		List<Shape> shapes = List.of(new Circle(5, Color.RED, 1.0, 3, 4, LocalDate.of(2026, 6, 1)),
				new Rectangle(4, 6, Color.GREEN, 1.5, 1, 1, LocalDate.of(2026, 6, 2)),
				new Ellipse(3, 2, Color.RED, 2.0, 0, 5, LocalDate.of(2026, 6, 3)),
				new Circle(3, Color.GREEN, 1.0, 6, 8, LocalDate.of(2026, 6, 4)),
				new Rectangle(5, 5, Color.BLUE, 1.0, 2, 2, LocalDate.of(2026, 6, 1)),
				new Ellipse(4, 3, Color.YELLOW, 1.5, 4, 3, LocalDate.of(2026, 6, 2))
		);
		// --- THÊM CODE VÀO ĐÂY ---
		ShapeManager shapeManager = new ShapeManager();
		System.out.println("-----------Areas all : ---------------");
		shapeManager.printAreas(shapes);
		System.out.println("-----------Distance from O(0,0) : ---------------");
		shapeManager.printDistances(shapes);
		System.out.println("----------Filter with radius have excludeBoundary : ---------------");
		shapeManager.filterWithinRadius(shapes, 4, false);
		System.out.println("----------Largest Areas : -------------");
		shapeManager.findLargestShape(shapes);
		System.out.println("----------Filter with radius : ----------");
		shapeManager.filterWithinRadius(shapes, 5);
		System.out.println("----------Shape report : ----------");
		shapeManager.printShapeReport(shapes);
		System.out.println("----------Circle count : ----------");
		shapeManager.countCircles(shapes);
		System.out.println("----------Circle count refactor : -----------");
		shapeManager.countCircles(shapes, "Ellipse");
		System.out.println("----------Filter by date : -----------");
		shapeManager.filterByDateRange(shapes, LocalDate.of(2026, 6, 2), LocalDate.of(2026, 7, 4));
		System.out.println("----------To String : -----------");
		Shape circle = new Circle(5, Color.RED, 1.0, 3, 4, LocalDate.of(2026, 6, 1));
		System.out.println(circle);
	}

}