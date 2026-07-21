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

	public PriceResponseDTO getPriceByTypeAndWeight(String typeOfAnimal, BigDecimal weight) {
		Price price = priceRepository.findByPetTypeAndWeight(typeOfAnimal, weight);
		return toDTO(price);
	}

	public PriceResponseDTO getPriceById(Long id) {
		Price price = priceRepository.findById(id);
		return toDTO(price);
	}

	public List<PriceResponseDTO> getAllPrices() {
		List<Price> prices = priceRepository.findAll();
		return prices.stream().map(this::toDTO).collect(Collectors.toList());
	}

	public PriceResponseDTO createPrice(Price priceEntity) {
		priceRepository.save(priceEntity);
		return toDTO(priceEntity);
	}

	public PriceResponseDTO updatePrice(Long id, Price priceDetails) {

		Price existingPrice = priceRepository.findById(id);
		existingPrice.setPetType(priceDetails.getPetType());
		existingPrice.setWeightFrom(priceDetails.getWeightFrom());
		existingPrice.setWeightTo(priceDetails.getWeightTo());
		existingPrice.setBasePrice(priceDetails.getBasePrice());

		priceRepository.update(existingPrice);
		return toDTO(existingPrice);
	}

	public void deletePrice(Long id) {
		priceRepository.findById(id);
		priceRepository.deleteById(id);
	}

	public PriceResponseDTO toDTO(Price price) {
		if (price == null) {
			return null;
		}
		PriceResponseDTO dto = new PriceResponseDTO();
		dto.setId(price.getId());
		dto.setPetType(price.getPetType());
		dto.setWeightFrom(price.getWeightFrom());
		dto.setWeightTo(price.getWeightTo());
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
		dto.setWeightFrom(price.getWeightFrom());
		dto.setWeightTo(price.getWeightTo());
		dto.setBasePrice(price.getBasePrice());
		dto.setDiscountPercentage(discountPercentage);
		dto.setActualPrice(actualPrice);
		return dto;
	}
}