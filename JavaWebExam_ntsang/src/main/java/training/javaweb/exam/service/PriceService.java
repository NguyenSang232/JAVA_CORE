package training.javaweb.exam.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.response.PriceResponseDTO;
import training.javaweb.exam.entity.Price;
import training.javaweb.exam.repository.PriceRepository;

@Service
public class PriceService {

    private final PriceRepository priceRepository;

    // Dùng Constructor Injection thay cho @Autowired trên field
    public PriceService(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }

    /**
     * 1. Lấy đơn giá dựa trên Loại động vật và Cân nặng (Có tính toán giảm giá nếu cần)
     * Bạn có thể tự truyền thêm discountPercentage và actualPrice từ logic giảm giá của bạn vào đây.
     */
    public PriceResponseDTO getPriceByTypeAndWeight(String typeOfAnimal, BigDecimal weight) {
        Price price = priceRepository.findByPetTypeAndWeight(typeOfAnimal, weight)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình giá cho " + typeOfAnimal + " với cân nặng " + weight + "kg"));
        
        // Mặc định ban đầu chưa tính giảm giá thành viên, nếu có logic tính giảm giá bạn hãy dùng hàm toCalculatedDTO nhé
        return toDTO(price);
    }

    /**
     * 2. Tìm cấu hình giá theo ID cụ thể
     */
    public PriceResponseDTO getPriceById(Long id) {
        Price price = priceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình giá với ID: " + id));
        return toDTO(price);
    }

    /**
     * 3. Lấy toàn bộ danh sách cấu hình giá hiện có
     */
    public List<PriceResponseDTO> getAllPrices() {
        List<Price> prices = priceRepository.findAll();
        return prices.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 4. Thêm mới một cấu hình giá
     */
    public PriceResponseDTO createPrice(Price priceEntity) {
        priceRepository.save(priceEntity); 
        // Sau khi save, MyBatis tự điền ID vừa sinh vào object priceEntity nhờ config useGeneratedKeys="true"
        return toDTO(priceEntity);
    }

    /**
     * 5. Cập nhật cấu hình giá đã có
     */
    public PriceResponseDTO updatePrice(Long id, Price priceDetails) {
        // Kiểm tra xem ID có tồn tại trong DB không trước khi sửa
        Price existingPrice = priceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình giá để cập nhật với ID: " + id));

        // Cập nhật các giá trị mới từ request vào object hiện tại
        existingPrice.setPetType(priceDetails.getPetType());
        existingPrice.setWeightFrom(priceDetails.getWeightFrom());
        existingPrice.setWeightTo(priceDetails.getWeightTo());
        existingPrice.setBasePrice(priceDetails.getBasePrice());

        priceRepository.update(existingPrice);
        return toDTO(existingPrice);
    }

    /**
     * 6. Xóa cấu hình giá theo ID
     */
    public void deletePrice(Long id) {
        priceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình giá để xóa với ID: " + id));
        priceRepository.deleteById(id);
    }

    // --- CÁC HÀM MAPPING SANG DTO ---

    public PriceResponseDTO toDTO(Price price) {
        if (price == null) {
            return null;
        }
        PriceResponseDTO dto = new PriceResponseDTO();
        dto.setId(price.getId());
        dto.setPetType(price.getPetType());
        dto.setBasePrice(price.getBasePrice());
        dto.setDiscountPercentage(0);
        dto.setActualPrice(price.getBasePrice());

        return dto;
    }

    public PriceResponseDTO toCalculatedDTO(Price price, int discountPercentage, BigDecimal actualPrice) {
        if (price == null) {
            return null;
        }

        PriceResponseDTO dto = new PriceResponseDTO();
        dto.setId(price.getId());
        dto.setPetType(price.getPetType());
        dto.setBasePrice(price.getBasePrice());
        dto.setDiscountPercentage(discountPercentage);
        dto.setActualPrice(actualPrice);

        return dto;
    }
}