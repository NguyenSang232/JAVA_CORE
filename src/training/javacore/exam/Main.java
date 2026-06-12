package training.javacore.exam;

import java.time.LocalDateTime;

public class Main {
	public static void main(String[] args) {
		PlantShop shop = new PlantShop();
		// Dữ liệu mẫu
		LocalDateTime now = LocalDateTime.now();

		shop.addPlant(new SucculentPlant("Sen Đá Hồng", 45000, 20, CareLevel.EASY_CARE, 7, now.minusDays(2)));

		shop.addPlant(new SucculentPlant("Xương Rồng Kim", 30000, 15, CareLevel.EASY_CARE, 14, now.minusDays(10)));

		shop.addPlant(
				new FloweringPlant("Lan Hồ Điệp", 350000, 5, CareLevel.HARD_CARE, FlowerColor.WHITE, now.minusDays(5)));

		shop.addPlant(new FloweringPlant("Hoa Hồng Nhung", 120000, 10, CareLevel.MEDIUM_CARE, FlowerColor.RED,
				now.minusDays(1)));

		shop.addPlant(new FoliagePlant("Trầu Bà Vàng", 55000, 30, CareLevel.EASY_CARE, LeafPattern.GOLDEN_SPOTS,
				now.minusDays(20)));

		shop.addPlant(new FoliagePlant("Lưỡi Hổ", 80000, 12, CareLevel.EASY_CARE, LeafPattern.GOLDEN_STRIPES,
				now.minusDays(3)));

		shop.addPlant(new FoliagePlant("Dương Xỉ Boston", 95000, 8, CareLevel.MEDIUM_CARE, LeafPattern.DARK_GREEN,
				now.minusDays(15)));
		// Ghi nhận một số giao dịch bán
		shop.recordSale("Sen Đá Hồng", 3);
		shop.recordSale("Lan Hồ Điệp", 1);
		shop.recordSale("Trầu Bà Vàng", 5);
		// Demo
		shop.displayAll();
		shop.displaySaleReport();
		// --- GỌI CÁC METHOD CÂU 3 Ở ĐÂY ---
		// ----------------------------------
		// Exercise 3.1
		shop.printMostExpensive();
		// Exercise 3.2
		shop.printTotalInventoryValue();
		// Exercise 3.3
		shop.printEasyCarePlants();
		// Exercise 3.4
		shop.printPlantSortedByPrice();
		// Exercise 3.5
//		shop.removePlant("Lưỡi Hổ");
		// Exercise 3.6
//		shop.updatePrice("Cây Mọng Nước", 5.0);
		System.out.println("---------------");
		// Exercise 4.1
		shop.printInventoryByType();
		// Exercise 4.2
		shop.findMostValuableType();
		// Exercise 3.7
//		shop.sellPlant("Dương Xỉ Boston", 5);
		shop.displaySaleReport();
		shop.displayAll();
		// Exercise 4.3
		shop.filterRecentPlants(4);
	}
}
