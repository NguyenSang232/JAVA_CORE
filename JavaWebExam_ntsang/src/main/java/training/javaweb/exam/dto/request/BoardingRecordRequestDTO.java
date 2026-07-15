package training.javaweb.exam.dto.request;

import java.time.LocalDate;
import java.util.List;

import training.javaweb.exam.dto.response.CareNoteResponseDTO;

public class BoardingRecordRequestDTO {

	private Long petId;

	private LocalDate checkInDate;

	private LocalDate expectedReturn;

	private Long pricePerDay;

	private Long baseFee;

	private Long lateFee;

	private Long totalFee;

	private String status;

	private String notes;

	public BoardingRecordRequestDTO() {
		super();
	}

	public BoardingRecordRequestDTO(Long petId, LocalDate checkInDate, LocalDate expectedReturn, Long pricePerDay,
			Long baseFee, Long lateFee, Long totalFee, String status, String notes,
			List<CareNoteResponseDTO> careNotes) {
		super();
		this.petId = petId;
		this.checkInDate = checkInDate;
		this.expectedReturn = expectedReturn;
		this.pricePerDay = pricePerDay;
		this.baseFee = baseFee;
		this.lateFee = lateFee;
		this.totalFee = totalFee;
		this.status = status;
		this.notes = notes;
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
}