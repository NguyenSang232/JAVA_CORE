package training.javaweb.exam.entity;

import java.math.BigDecimal;

public class Price {
    private Long id;
    private String petType;
    private BigDecimal weightFrom;
    private BigDecimal weightTo;
    private BigDecimal basePrice;

    public Price() {
    }

    public Price(Long id, String petType, BigDecimal weightFrom, BigDecimal weightTo, BigDecimal basePrice) {
        this.id = id;
        this.petType = petType;
        this.weightFrom = weightFrom;
        this.weightTo = weightTo;
        this.basePrice = basePrice;
    }

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPetType() { return petType; }
    public void setPetType(String petType) { this.petType = petType; }

    public BigDecimal getWeightFrom() { return weightFrom; }
    public void setWeightFrom(BigDecimal weightFrom) { this.weightFrom = weightFrom; }

    public BigDecimal getWeightTo() { return weightTo; }
    public void setWeightTo(BigDecimal weightTo) { this.weightTo = weightTo; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
}