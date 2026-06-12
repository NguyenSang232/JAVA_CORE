package training.javacore.exam;

import java.time.LocalDateTime;

public class FloweringPlant extends Plant {
	private FlowerColor FlowerColor;

	public FloweringPlant(String name, double price, int quantity, CareLevel careLevel, FlowerColor FlowerColor,
			LocalDateTime importedDate) {
		super(name, price, quantity, careLevel, importedDate);
		this.FlowerColor = FlowerColor;
	}

	public FlowerColor getFlowerColor() {
		return FlowerColor;
	}

	// GetType --> getType
	@Override
	public String getType() {
		return "Cây Có Hoa";
	}

	// DisplayInfo ---> displayInfo
	@Override
	public String displayInfo() {
		return super.displayInfo() + " | Màu hoa: " + FlowerColor;
	}
}
