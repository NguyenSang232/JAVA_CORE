package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.response.CareNoteResponseDTO;
import training.javaweb.exam.entity.CareNote;
import training.javaweb.exam.repository.CareNoteRepository;

@Service
public class CareNoteService {

	@Autowired
	private CareNoteRepository careNoteRepository;

	// Create
	public void create(CareNoteResponseDTO dto) {
		careNoteRepository.insert(toEntity(dto));
	}

	public List<CareNoteResponseDTO> getAll() {
		return careNoteRepository.getAll();
	}

	// Get by Boarding
	public List<CareNoteResponseDTO> getByBoardingId(Long boardingId) {
		return careNoteRepository.findByBoardingId(boardingId);
	}

	public CareNoteResponseDTO getById(Long id) {
		return careNoteRepository.findById(id);
	}

	// Get My Notes
	public List<CareNoteResponseDTO> getMyNotes(Long userId, Long boardingId) {
		return careNoteRepository.findMyNotes(userId, boardingId);
	}

	// DTO -> Entity
	public CareNote toEntity(CareNoteResponseDTO dto) {

		if (dto == null)
			return null;

		CareNote note = new CareNote();
		note.setId(dto.getId());
		note.setBoardingRecordId(dto.getBoardingRecordId());
		note.setNote(dto.getNote());
		return note;
	}
}