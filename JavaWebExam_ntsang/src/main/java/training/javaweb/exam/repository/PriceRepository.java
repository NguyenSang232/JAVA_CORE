package training.javaweb.exam.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.entity.Price;
import training.javaweb.exam.mapper.PriceMapper;

@Repository
public class PriceRepository {

    @Autowired
    private PriceMapper priceMapper;

    // 1. Tìm đơn giá gốc dựa trên Loại động vật và Cân nặng thực tế
    public Optional<Price> findByPetTypeAndWeight(String petType, java.math.BigDecimal weight) {
        return Optional.ofNullable(priceMapper.findByPetTypeAndWeight(petType, weight));
    }

    // 2. Tìm cấu hình giá theo ID
    public Optional<Price> findById(Long id) {
        return Optional.ofNullable(priceMapper.findById(id));
    }

    // 3. Lấy tất cả cấu hình giá trong hệ thống
    public List<Price> findAll() {
        return priceMapper.findAll();
    }

    // 4. Thêm mới cấu hình giá
    public int save(Price price) {
        return priceMapper.save(price);
    }

    // 5. Cập nhật cấu hình giá
    public int update(Price price) {
        return priceMapper.update(price);
    }

    // 6. Xóa cấu hình giá theo ID
    public int deleteById(Long id) {
        return priceMapper.deleteById(id);
    }
}