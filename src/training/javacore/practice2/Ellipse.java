package training.javacore.practice2;

import java.time.LocalDate;

//ellipse -->  Ellipse, shape --> Shape
public class Ellipse extends Shape {
	// Major_Axis --> majorAxis, MinorAxis --> minorAxis
	private double majorAxis;

	private double minorAxis;

	public Ellipse(double majorAxis, double minorAxis, Color color, double borderWidth, double x, double y,
			LocalDate createAt) {
		super(color, borderWidth, x, y, createAt);
		this.majorAxis = majorAxis;
		this.minorAxis = minorAxis;
	}

	// GetName --> getName()
	@Override
	public String getName() {
		return "Ellipse";
	}

	// CalcArea() --> calcArea()
	@Override
	public double calcArea() {
		if (majorAxis <= 0 || minorAxis <= 0) {
			throw new IllegalArgumentException("Major Axis and Minor Axis cannot less than 0!");
		}
		return Math.PI * majorAxis * minorAxis;
	}

	private double getMajorAxis() {
		return majorAxis;
	}

	private double getMinorAxis() {
		return minorAxis;
	}

	// Exercise 4 - L
	public String toString() {
		return super.toString() + String.format(" | Major Axis: %.2f | Minor Axis = %.2f", majorAxis, minorAxis);
	}
}