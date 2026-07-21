package training.javaweb.exam.dto.response;

import java.math.BigDecimal;

public class PriceResponseDTO {
	private Long id;
	private String petType;
	private BigDecimal weightFrom;
	private BigDecimal weightTo;
	private BigDecimal basePrice;
	private int discountPercentage;
	private BigDecimal actualPrice;

	public PriceResponseDTO() {
	}

	public PriceResponseDTO(Long id, String petType, BigDecimal weightFrom, BigDecimal weightTo, BigDecimal basePrice,
			int discountPercentage, BigDecimal actualPrice) {
		this.id = id;
		this.petType = petType;
		this.weightFrom = weightFrom;
		this.weightTo = weightTo;
		this.basePrice = basePrice;
		this.discountPercentage = discountPercentage;
		this.actualPrice = actualPrice;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPetType() {
		return petType;
	}

	public void setPetType(String petType) {
		this.petType = petType;
	}

	public BigDecimal getWeightFrom() {
		return weightFrom;
	}

	public void setWeightFrom(BigDecimal weightFrom) {
		this.weightFrom = weightFrom;
	}

	public BigDecimal getWeightTo() {
		return weightTo;
	}

	public void setWeightTo(BigDecimal weightTo) {
		this.weightTo = weightTo;
	}

	public BigDecimal getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(BigDecimal basePrice) {
		this.basePrice = basePrice;
	}

	public int getDiscountPercentage() {
		return discountPercentage;
	}

	public void setDiscountPercentage(int discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public BigDecimal getActualPrice() {
		return actualPrice;
	}

	public void setActualPrice(BigDecimal actualPrice) {
		this.actualPrice = actualPrice;
	}
}