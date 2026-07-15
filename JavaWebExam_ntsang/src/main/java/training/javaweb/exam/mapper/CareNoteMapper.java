package training.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.response.CareNoteResponseDTO;
import training.javaweb.exam.entity.CareNote;

@Mapper
public interface CareNoteMapper {

	void insert(CareNote careNote);

	CareNoteResponseDTO findById(Long id);

	List<CareNoteResponseDTO> findAll();

	List<CareNoteResponseDTO> findByBoardingId(Long boardingId);

	List<CareNoteResponseDTO> findMyNotes(Long userId, Long boardingId);

}