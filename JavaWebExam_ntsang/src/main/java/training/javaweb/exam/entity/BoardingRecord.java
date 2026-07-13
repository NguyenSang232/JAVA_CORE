package training.javaweb.exam.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BoardingRecord {

	private Long id;

	private Long petId;

	private LocalDate checkInDate;

	private LocalDate expectedReturn;

	private LocalDate actualCheckOut;

	private Long pricePerDay;

	private Long baseFee;

	private Long lateFee;

	private Long totalFee;

	// BOARDING | RETURNED
	private String status;

	private String notes;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	// Join
	private Pet pet;

	private List<CareNote> careNotes;

	public BoardingRecord() {
		super();
	}

	public BoardingRecord(Long id, Long petId, LocalDate checkInDate, LocalDate expectedReturn,
			LocalDate actualCheckOut, Long pricePerDay, Long baseFee, Long lateFee,
			Long totalFee, String status, String notes,
			LocalDateTime createdAt, LocalDateTime updatedAt,
			Pet pet, List<CareNote> careNotes) {
		super();
		this.id = id;
		this.petId = petId;
		this.checkInDate = checkInDate;
		this.expectedReturn = expectedReturn;
		this.actualCheckOut = actualCheckOut;
		this.pricePerDay = pricePerDay;
		this.baseFee = baseFee;
		this.lateFee = lateFee;
		this.totalFee = totalFee;
		this.status = status;
		this.notes = notes;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.pet = pet;
		this.careNotes = careNotes;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPetId() {
		return petId;
	}

	public void setPetId(Long petId) {
		this.petId = petId;
	}

	public LocalDate getCheckInDate() {
		return checkInDate;
	}

	public void setCheckInDate(LocalDate checkInDate) {
		this.checkInDate = checkInDate;
	}

	public LocalDate getExpectedReturn() {
		return expectedReturn;
	}

	public void setExpectedReturn(LocalDate expectedReturn) {
		this.expectedReturn = expectedReturn;
	}

	public LocalDate getActualCheckOut() {
		return actualCheckOut;
	}

	public void setActualCheckOut(LocalDate actualCheckOut) {
		this.actualCheckOut = actualCheckOut;
	}

	public Long getPricePerDay() {
		return pricePerDay;
	}

	public void setPricePerDay(Long pricePerDay) {
		this.pricePerDay = pricePerDay;
	}

	public Long getBaseFee() {
		return baseFee;
	}

	public void setBaseFee(Long baseFee) {
		this.baseFee = baseFee;
	}

	public Long getLateFee() {
		return lateFee;
	}

	public void setLateFee(Long lateFee) {
		this.lateFee = lateFee;
	}

	public Long getTotalFee() {
		return totalFee;
	}

	public void setTotalFee(Long totalFee) {
		this.totalFee = totalFee;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Pet getPet() {
		return pet;
	}

	public void setPet(Pet pet) {
		this.pet = pet;
	}

	public List<CareNote> getCareNotes() {
		return careNotes;
	}

	public void setCareNotes(List<CareNote> careNotes) {
		this.careNotes = careNotes;
	}

}