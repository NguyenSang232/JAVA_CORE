package training.javaweb.exam.mapper;

import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import training.javaweb.exam.entity.Price;

@Mapper
public interface PriceMapper {
    Price findById(Long id);
    
    // Sử dụng @Param để MyBatis định danh đúng tham số trong file XML
    Price findByPetTypeAndWeight(@Param("petType") String petType, @Param("weight") BigDecimal weight);
    
    List<Price> findAll();
    
    int save(Price price);
    
    int update(Price price);
    
    int deleteById(Long id);
}