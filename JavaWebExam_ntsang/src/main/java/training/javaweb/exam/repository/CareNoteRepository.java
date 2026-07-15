package training.javaweb.exam.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.response.CareNoteResponseDTO;
import training.javaweb.exam.entity.CareNote;
import training.javaweb.exam.mapper.CareNoteMapper;

@Repository
public class CareNoteRepository {

	@Autowired
	private CareNoteMapper mapper;

	public void insert(CareNote note) {
		mapper.insert(note);
	}

	public List<CareNoteResponseDTO> getAll() {
		return mapper.findAll();
	}

	public CareNoteResponseDTO findById(Long id) {
		return mapper.findById(id);
	}

	public List<CareNoteResponseDTO> findByBoardingId(Long boardingId) {
		return mapper.findByBoardingId(boardingId);
	}

	public List<CareNoteResponseDTO> findMyNotes(Long userId, Long boardingId) {
		return mapper.findMyNotes(userId, boardingId);
	}
}