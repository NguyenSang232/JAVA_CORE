package training.javacore.exam;

import java.time.LocalDateTime;

public class SucculentPlant extends Plant {
	// water_frequency_days --> waterFrequencyDays
	private int waterFrequencyDays;

	public SucculentPlant(String name, double price, int quantity, CareLevel careLevel, int waterFrequencyDays,
			LocalDateTime importedDate) {
		super(name, price, quantity, careLevel, importedDate);
		this.waterFrequencyDays = waterFrequencyDays;
	}

	public int getWaterFrequencyDays() {
		return waterFrequencyDays;
	}

	// GetType --> getType
	@Override
	public String getType() {
		return "Cây Mọng Nước";
	}

	// DisplayInfo ---> displayInfo
	@Override
	public String displayInfo() {
		return super.displayInfo() + " | Tưới mỗi " + waterFrequencyDays + " ngày";
	}
}
