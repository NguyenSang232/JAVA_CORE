package training.javacore.exam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public abstract class Plant {
	private String name;
	private double price;
	private int quantity;
	private CareLevel careLevel;
	// ImportedDate --> importedDate;
	private LocalDateTime importedDate;

	public Plant(String name, double price, int quantity, CareLevel careLevel, LocalDateTime importedDate) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.careLevel = careLevel;
		this.importedDate = importedDate;
	}

	public String getName() {
		return name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public CareLevel getCareLevel() {
		return careLevel;
	}

	public LocalDateTime getImportedDate() {
		return importedDate;
	}

	// GetType --> getType
	public abstract String getType();

	// DisplayInfo --> displayInfo
	public String displayInfo() {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
		return String.format("[%s] %s | Giá: %,.0f đ | SL: %d | Chăm sóc: %s | Nhập: %s", getType(), name, price,
				quantity, careLevel, importedDate.format(formatter));
	}
}
