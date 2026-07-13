package training.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.CareNoteDTO;
import training.javaweb.exam.entity.CareNote;

@Mapper
public interface CareNoteMapper {

	void insert(CareNote careNote);

	List<CareNoteDTO> findByBoardingId(Long boardingId);

	List<CareNoteDTO> findMyNotes(Long userId, Long boardingId);

	void update(CareNote careNote);

	void delete(Long id);

}