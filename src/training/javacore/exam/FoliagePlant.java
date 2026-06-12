package training.javacore.exam;

import java.time.LocalDateTime;

public class FoliagePlant extends Plant {
	private LeafPattern leafPattern;

	public FoliagePlant(String name, double price, int quantity, CareLevel careLevel, LeafPattern leafPattern,
			LocalDateTime importedDate) {
		super(name, price, quantity, careLevel, importedDate);
		this.leafPattern = leafPattern;
	}

	public LeafPattern getLeafPattern() {
		return leafPattern;
	}

	// GetType --> getType
	@Override
	public String getType() {
		return "Cây Lá";
	}

	// DisplayInfo ---> displayInfo
	@Override
	public String displayInfo() {
		return super.displayInfo() + " | Hoa văn lá: " + leafPattern;
	}
}
