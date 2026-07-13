package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.CareNoteDTO;
import training.javaweb.exam.entity.CareNote;
import training.javaweb.exam.repository.CareNoteRepository;

@Service
public class CareNoteService {

	@Autowired
	private CareNoteRepository careNoteRepository;

	// Create
	public void create(CareNoteDTO dto) {
		careNoteRepository.insert(toEntity(dto));
	}

	// Get by Boarding
	public List<CareNoteDTO> getByBoardingId(Long boardingId) {
		return careNoteRepository.findByBoardingId(boardingId);
	}

	// Get My Notes
	public List<CareNoteDTO> getMyNotes(Long userId, Long boardingId) {
		return careNoteRepository.findMyNotes(userId, boardingId);
	}

	// Update
	public void update(Long id, CareNoteDTO dto) {
		CareNote note = toEntity(dto);
		note.setId(id);
		careNoteRepository.update(note);
	}

	// Delete
	public void delete(Long id) {
		careNoteRepository.delete(id);
	}

	// DTO -> Entity
	public CareNote toEntity(CareNoteDTO dto) {

		if (dto == null)
			return null;

		CareNote note = new CareNote();
		note.setId(dto.getId());
		note.setBoardingRecordId(dto.getBoardingRecordId());
		note.setNote(dto.getNote());
		return note;
	}
}