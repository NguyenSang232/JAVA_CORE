package training.javaweb.exam.dto;

import java.time.LocalDate;
import java.util.List;

public class BoardingRecordDTO {

	private Long id;

	private Long petId;

	private String petName;

	private String ownerName;

	private LocalDate checkInDate;

	private LocalDate expectedReturn;

	private LocalDate actualCheckOut;

	private Long pricePerDay;

	private Long baseFee;

	private Long lateFee;

	private Long totalFee;

	private String status;

	private String notes;

	private List<CareNoteDTO> careNotes;

	public BoardingRecordDTO() {
		super();
	}

	public BoardingRecordDTO(Long id, Long petId, String petName, String ownerName, LocalDate checkInDate,
			LocalDate expectedReturn, LocalDate actualCheckOut, Long pricePerDay, Long baseFee, Long lateFee,
			Long totalFee, String status, String notes, List<CareNoteDTO> careNotes) {
		super();
		this.id = id;
		this.petId = petId;
		this.petName = petName;
		this.ownerName = ownerName;
		this.checkInDate = checkInDate;
		this.expectedReturn = expectedReturn;
		this.actualCheckOut = actualCheckOut;
		this.pricePerDay = pricePerDay;
		this.baseFee = baseFee;
		this.lateFee = lateFee;
		this.totalFee = totalFee;
		this.status = status;
		this.notes = notes;
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

	public String getPetName() {
		return petName;
	}

	public void setPetName(String petName) {
		this.petName = petName;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
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

	public List<CareNoteDTO> getCareNotes() {
		return careNotes;
	}

	public void setCareNotes(List<CareNoteDTO> careNotes) {
		this.careNotes = careNotes;
	}

}