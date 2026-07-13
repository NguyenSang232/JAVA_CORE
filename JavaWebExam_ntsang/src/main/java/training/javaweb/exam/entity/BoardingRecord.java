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

	// join
	private Pet pet;

	private List<CareNote> careNotes;

}