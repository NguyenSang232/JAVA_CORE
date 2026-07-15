package training.javaweb.exam.dto.response;

import java.time.LocalDate;

public class CareNoteResponseDTO {

	private Long id;

	private String note;

	private LocalDate createdAt;

	private Long boardingRecordId;

	public CareNoteResponseDTO(Long id, String note, LocalDate createdAt) {
		super();
		this.id = id;
		this.note = note;
		this.createdAt = createdAt;
	}

	public CareNoteResponseDTO() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public Long getBoardingRecordId() {
		return boardingRecordId;
	}

}