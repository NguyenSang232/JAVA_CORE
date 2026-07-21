package training.javaweb.exam.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.entity.Price;
import training.javaweb.exam.mapper.PriceMapper;

@Repository
public class PriceRepository {

	@Autowired
	private PriceMapper priceMapper;

	public Price findByPetTypeAndWeight(String petType, java.math.BigDecimal weight) {
		return priceMapper.findByPetTypeAndWeight(petType, weight);
	}

	public Price findById(Long id) {
		return priceMapper.findById(id);
	}

	public List<Price> findAll() {
		return priceMapper.findAll();
	}

	public int save(Price price) {
		return priceMapper.save(price);
	}

	public int update(Price price) {
		return priceMapper.update(price);
	}

	public int deleteById(Long id) {
		return priceMapper.deleteById(id);
	}
}