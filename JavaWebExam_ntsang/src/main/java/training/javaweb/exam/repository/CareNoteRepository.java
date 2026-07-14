package training.javaweb.exam.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.CareNoteDTO;
import training.javaweb.exam.entity.CareNote;
import training.javaweb.exam.mapper.CareNoteMapper;

@Repository
public class CareNoteRepository {

	@Autowired
	private CareNoteMapper mapper;

	public void insert(CareNote note) {
		mapper.insert(note);
	}

	public List<CareNoteDTO> findByBoardingId(Long boardingId) {
		return mapper.findByBoardingId(boardingId);
	}

	public List<CareNoteDTO> findMyNotes(Long userId, Long boardingId) {
		return mapper.findMyNotes(userId, boardingId);
	}

	public void update(CareNote note) {
		mapper.update(note);
	}

	public void delete(Long id) {
		mapper.delete(id);
	}

	public List<CareNoteDTO> findByBoardingRecordId(Long boardingRecordId) {
        return mapper.findByBoardingId(boardingRecordId);
    }

}