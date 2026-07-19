package training.javaweb.exam.dto.response;

import java.math.BigDecimal;

public class PriceResponseDTO {
    private Long id;
    private String petType;
    private BigDecimal basePrice;
    private int discountPercentage; // % giảm giá dựa trên tiền tích lũy của khách
    private BigDecimal actualPrice;   // Giá cuối cùng sau khi chiết khấu

    public PriceResponseDTO() {
    }

    public PriceResponseDTO(Long id, String petType, BigDecimal basePrice, int discountPercentage, BigDecimal actualPrice) {
        this.id = id;
        this.petType = petType;
        this.basePrice = basePrice;
        this.discountPercentage = discountPercentage;
        this.actualPrice = actualPrice;
    }

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPetType() { return petType; }
    public void setPetType(String petType) { this.petType = petType; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public int getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(int discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getActualPrice() { return actualPrice; }
    public void setActualPrice(BigDecimal actualPrice) { this.actualPrice = actualPrice; }
}