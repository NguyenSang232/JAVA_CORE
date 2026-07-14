package training.javaweb.exam.dto;

import java.time.LocalDateTime;

public class CareNoteDTO {

	private Long id;

	private Long boardingRecordId;

	private String note;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	public CareNoteDTO() {
		super();
	}

	public CareNoteDTO(Long id, Long boardingRecordId, String note, LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.boardingRecordId = boardingRecordId;
		this.note = note;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBoardingRecordId() {
		return boardingRecordId;
	}

	public void setBoardingRecordId(Long boardingRecordId) {
		this.boardingRecordId = boardingRecordId;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
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

}