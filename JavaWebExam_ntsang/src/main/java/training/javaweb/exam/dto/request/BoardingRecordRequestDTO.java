package training.javaweb.exam.dto.request;

import java.time.LocalDate;
import java.util.List;

import training.javaweb.exam.dto.response.CareNoteResponseDTO;

public class BoardingRecordRequestDTO {

	private Long petId;

	private LocalDate checkInDate;

	private LocalDate expectedReturn;

	private Long baseFee;

	private String status;

	private String notes;

	private Long pricePerDay;

	public Long getPricePerDay() {
		return pricePerDay;
	}

	public void setPricePerDay(Long pricePerDay) {
		this.pricePerDay = pricePerDay;
	}

	public BoardingRecordRequestDTO() {
		super();
	}

	public BoardingRecordRequestDTO(Long petId, LocalDate checkInDate, LocalDate expectedReturn, Long pricePerDay,
			Long baseFee, String status, String notes, List<CareNoteResponseDTO> careNotes) {
		super();
		this.petId = petId;
		this.checkInDate = checkInDate;
		this.expectedReturn = expectedReturn;
		this.baseFee = baseFee;
		this.status = status;
		this.notes = notes;
		this.pricePerDay = pricePerDay;
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

	public Long getBaseFee() {
		return baseFee;
	}

	public void setBaseFee(Long baseFee) {
		this.baseFee = baseFee;
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