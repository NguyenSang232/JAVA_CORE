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

}