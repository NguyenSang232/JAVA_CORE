package training.javacore.practice2;

import java.time.LocalDate;

// rectangle --> Rectangle, shape --> Shape
public class Rectangle extends Shape implements Resizable {
	// Width --> width, Height --> height
	private double width;

	private double height;

	public Rectangle(double width, double height, Color color, double borderWidth, double x, double y,
			LocalDate createAt) {
		super(color, borderWidth, x, y, createAt);
		this.width = width;
		this.height = height;
	}

	// GetName() --> getName()
	@Override
	public String getName() {
		return "Rectangle";
	}

	// CalcArea() --> calcArea()
	@Override
	public double calcArea() {
		if (width <= 0 || height <= 0) {
			throw new IllegalArgumentException("Width and Height cannot less than 0!");
		}
		return width * height;
	}

	private double getWidth() {
		return width;
	}

	private double getHeight() {
		return height;
	}

	// Exercise 4 - m
	@Override
	public Shape resize(double factor) {
		return new Rectangle(this.width * factor, this.height * factor, this.getColor(), this.getBorderWidth(),
				this.getX(), this.getY(), this.getCreatedAt());
	}
}