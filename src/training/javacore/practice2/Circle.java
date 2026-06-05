package training.javacore.practice2;

import java.time.LocalDate;

//circle --> Circle
public class Circle extends Shape implements Resizable {
	// Radius --> radius;
	private double radius;

	// circle --> Circle
	public Circle(double radius, Color color, double borderWidth, double x, double y, LocalDate createAt) {
		super(color, borderWidth, x, y, createAt);
		this.radius = radius;
	}

	// GetName() --> getName()
	@Override
	public String getName() {
		return "Circle";
	}

	// CalcArea() --> calcArea()
	@Override
	public double calcArea() {
		if (radius <= 0) {
			throw new IllegalArgumentException("Radius cannot less than 0!");
		}
		return Math.PI * radius * radius;
	}

	private double getRadius() {
		return radius;
	}

	// Exercise 4 - m
	@Override
	public Shape resize(double factor) {
		return new Circle(this.radius * factor, this.getColor(), this.getBorderWidth(), this.getX(), this.getY(),
				this.getCreatedAt());
	}

}