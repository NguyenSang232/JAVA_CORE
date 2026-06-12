package training.javacore.exam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//=============================
//Class chính: PlantShop
//=============================
public class PlantShop {
	private List<Plant> plantList;
	// SaleRecord --> saleRecord;
	private Map<String, Integer> saleRecord;

	public PlantShop() {
		plantList = new ArrayList<>();
		saleRecord = new HashMap<>();
	}

	public void addPlant(Plant plant) {
		plantList.add(plant);
	}

	// [COMMENT HERE - A]
	// Tại sao dùng Map ở đây thay vì List?
	// This function to aggregate data by key; using a list would lead to duplicate
	// values
	// Map allows us to store and update sales quantities by plant name.
	public void recordSale(String plantName, int quantity) {
		saleRecord.put(plantName, saleRecord.getOrDefault(plantName, 0) + quantity);
	}

	// [COMMENT HERE - B]
	// Tại sao dùng vòng lặp for-each thay vì for thông thường ở đây?
	// Tại sao check plantList.isEmpty() trước?
	// Use for-each to help clean code, avoid IndexOutOfBoundsException
	// A for-each loop is used because we only need to read
	// every Plant object in the collection.
	// Checking plantList.isEmpty() first prevents unnecessary
	// processing and provides a clear message when no plants exist.
	public void displayAll() {
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}

		System.out.println("===== DANH SÁCH CÂY CẢNH =====");
		for (Plant plant : plantList) {
			System.out.println(plant.displayInfo());
		}

		System.out.println("------------------------------");
	}

	// [COMMENT HERE - C]
	// Tại sao method này trả về Plant thay vì void?
	// Điều gì xảy ra nếu list rỗng ? Nếu tất cả giá bằng nhau?
	// It returns the actual object for further access information.
	// Returns null if empty because there is no plant to compare
	// Return the first match if prices are equal.
	public Plant findMostExpensive() {
		if (plantList.isEmpty())
			return null;
		Plant result = plantList.get(0);
		for (Plant plant : plantList) {
			if (plant.getPrice() > result.getPrice()) {
				result = plant;
			}
		}
		return result;
	}

	// [COMMENT HERE - D]
	// Tại sao nhân price * quantity thay vì chỉ cộng price?
	// We multiply price by quantity because inventory value
	// is the total value of all units in stock, not just one plant.
	// For example, if a plant costs 100,000 VND and there are
	// 10 units in stock, its inventory value is 1,000,000 VND.
	public double calculateTotalInventoryValue() {
		double total = 0;
		for (Plant plant : plantList) {
			total += plant.getPrice() * plant.getQuantity();
		}
		return total;
	}

	// [COMMENT HERE - E]
	// Tại sao dùng instanceof ở đây?
	// Kết quả method này liên quan thế nào đến recordSale()?
	// recordSale() only stores the plant name and the quantity sold
	// It does not store the plant type
	// Therefore, when generating the sales report, we need to search
	// for the corresponding Plant object in plantList and use instanceof
	// to determine its actual Type
	// This allows the report to display both the sales quantity and
	// the correct plant category.
	public void displaySaleReport() {
		System.out.println("===== BÁO CÁO BÁN HÀNG =====");
		if (saleRecord.isEmpty()) {
			System.out.println("Chưa có giao dịch nào.");
			return;
		}

		for (Map.Entry<String, Integer> entry : saleRecord.entrySet()) {
			Plant found = null;
			for (Plant p : plantList) {
				if (p.getName().equals(entry.getKey())) {
					found = p;
					break;
				}
			}

			String type = (found instanceof SucculentPlant) ? "Cây Mọng Nước"
					: (found instanceof FloweringPlant) ? "Cây Có Hoa" : "Cây Lá";

			System.out.printf("- %s (%s): đã bán %d cây\n", entry.getKey(), type, entry.getValue());
		}
		System.out.println("------------------------------");
	}

	public List<Plant> getPlantList() {
		return plantList;
	}

	// ============================================================
	// --- THÊM CODE VÀO ĐÂY (Câu 3.1 -> 4.3) ---
	// ============================================================
	// Exercise 3.1
	protected void printMostExpensive() {
		Plant expensiveTree = findMostExpensive();
		System.out.printf("Tên: %s | loại: %s | giá: %,.0f đồng\n", expensiveTree.getName(), expensiveTree.getType(),
				expensiveTree.getPrice());
	}

	// Exercise 3.2
	protected void printTotalInventoryValue() {
		double total = calculateTotalInventoryValue();
		System.out.printf("Tổng tồn kho: %,.0f đồng\n", total);
	}

	// Exercise 3.3
	protected void printEasyCarePlants() {
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		boolean isFound = false;
		for (Plant plant : plantList) {
			if (plant.getCareLevel().equals(CareLevel.EASY_CARE)) {
				System.out.printf("Tên: %s -- Mức độ chăm sóc: %s -- Giá: %,.0f đồng\n", plant.getName(),
						plant.getCareLevel(), plant.getPrice());
				isFound = true;
			}
		}
		if (!isFound) {
			System.out.println("Not found: " + CareLevel.EASY_CARE);
		}
	}

	// Exercise 3.4
	protected void printPlantSortedByPrice() {
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		List<Plant> results = plantList.stream().sorted(Comparator.comparingDouble(Plant::getPrice))
				.collect(Collectors.toList());
		for (Plant plant : results) {
			System.out.println(plant.displayInfo());
		}
	}

	// Exercise 3.5
	protected void removePlant(String namePlant) {
		if (namePlant == null || namePlant.trim().isEmpty()) {
			System.out.println("Input invalid");
			return;
		}
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		Plant remove = null;
		for (Plant plant : plantList) {
			if (plant.getName().equalsIgnoreCase(namePlant)) {
				remove = plant;
				break;
			}
		}
		if (remove != null) {
			plantList.remove(remove);
			System.out.println("Delete " + namePlant + " successful");
		} else {
			System.out.println("Không tìm thấy cây: [" + namePlant + "]");
		}
	}

	// Exercise 3.6
	protected void updatePrice(String plantType, double percentage) {
		if (plantType == null || plantType.trim().isEmpty()) {
			System.out.println("Input invalid");
			return;
		}
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		List<Plant> updatedPlants = new ArrayList<>();
		for (Plant plant : plantList) {
			if (plant.getType().equalsIgnoreCase(plantType)) {
				double oldPrice = plant.getPrice();
				double newPrice = oldPrice * (1 + percentage / 100.0);
				plant.setPrice(newPrice);
				updatedPlants.add(plant);
			}
		}
		if (updatedPlants.isEmpty()) {
			System.out.println("Không tìm thấy loại cây:[" + plantType + "]");
		} else {
			System.out.println("List after update: ");
			for (Plant plant : updatedPlants) {
				System.out.println(plant.displayInfo());
			}
		}
	}

	// Exercise 3.7
	protected void sellPlant(String namePlant, int quantity) {
		if (namePlant == null || namePlant.trim().isEmpty() || quantity <= 0) {
			System.out.println("Input invalid");
			return;
		}
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		Plant foundPlant = null;
		for (Plant plant : plantList) {
			if (plant.getName().equalsIgnoreCase(namePlant)) {
				foundPlant = plant;
				break;
			}
		}
		if (foundPlant == null) {
			System.out.println("Không tìm thấy cây: [" + namePlant + "]");
			return;
		}
		if (foundPlant.getQuantity() < quantity) {
			System.out.println("Không đủ hàng");
			return;
		}
		int quantityAfterSell = foundPlant.getQuantity() - quantity;
		recordSale(foundPlant.getName(), quantity);
		if (quantityAfterSell == 0) {
			plantList.remove(foundPlant);
			System.out.println("Đã bán hết và xóa khỏi danh sách: [" + namePlant + "]");
		} else {
			foundPlant.setQuantity(quantityAfterSell);
			System.out.println("Sold successful!");
			System.out.println(foundPlant.displayInfo());
		}
	}

	protected double calculateSinglePlantValue(Plant plant) {
		return plant.getPrice() * plant.getQuantity();
	}

	// Exercise 4.1
	protected void printInventoryByType() {
		if (plantList.isEmpty()) {
			System.out.println("Danh sách cây trống.");
			return;
		}
		String[] types = { "Cây Mọng Nước", "Cây Có Hoa", "Cây Lá" };
		for (String type : types) {
			double groupTotal = 0;
			boolean isHavePlant = false;
			for (Plant plant : plantList) {
				if (plant.getType().equalsIgnoreCase(type)) {
					if (!isHavePlant) {
						System.out.println("[" + type + "]");
						isHavePlant = true;
					}
					System.out.printf("- %s | SL: %d | Giá: %,.0f đ\n", plant.getName(), plant.getQuantity(),
							plant.getPrice());
					groupTotal += calculateSinglePlantValue(plant);
				}
			}
			if (isHavePlant) {
				System.out.printf("Tổng nhóm: %,.0f đồng\n", groupTotal);
			} else {
				 System.out.println("Không có cây nào thuộc loại : "+ type);
			}
		}
	}

	// Exercise 4.2
	protected String findMostValuableType() {
		if (plantList.isEmpty()) {
			throw new IllegalArgumentException("Danh sách cây rỗng");
		}
		String[] types = { "Cây Mọng Nước", "Cây Có Hoa", "Cây Lá" };
		String maxTypeValue = "";
		double maxGroupValue = 0;
		for (String type : types) {
			double groupTotal = 0;
			for (Plant plant : plantList) {
				if (plant.getType().equalsIgnoreCase(type)) {
					groupTotal += calculateSinglePlantValue(plant);
				}
			}
			if (groupTotal > maxGroupValue) {
				maxGroupValue = groupTotal;
				maxTypeValue = type;
			}
		}
		return maxTypeValue;
	}

	protected List<Plant> filterRecentPlants(int days) {
		if (days <= 0) {
			throw new IllegalArgumentException("Days must be greater than 0.");
		}
		if (plantList.isEmpty()) {
			throw new IllegalArgumentException("Danh sách cây rỗng");
		}
		List<Plant> results = new ArrayList<>();
		boolean isFound = false;
		LocalDateTime today = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
		LocalDateTime rangeDay = today.minusDays(days - 1).withHour(0).withMinute(0).withSecond(0).withNano(0);
		for (Plant plant : plantList) {
			LocalDateTime entryDate = plant.getImportedDate();
			if (!entryDate.isBefore(rangeDay) && !entryDate.isAfter(today)) {
				isFound = true;
				results.add(plant);
			}
		}
		if (!isFound) {
			System.out.println("Không có cây nào được nhập trong " + days + " ngày qua. ");
		}
		return results;
	}
}