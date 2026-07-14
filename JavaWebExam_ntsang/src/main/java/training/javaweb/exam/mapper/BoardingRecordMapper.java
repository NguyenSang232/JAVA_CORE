package training.javaweb.exam.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.entity.BoardingRecord;

@Mapper
public interface BoardingRecordMapper {

	void insert(BoardingRecord record);

	List<BoardingRecordResponseDTO> findAll();

	BoardingRecordResponseDTO findDetail(Long id);

	List<BoardingRecordResponseDTO> findCurrentBoarding();

	List<BoardingRecordResponseDTO> findHistoryByPet(Long petId);

	List<BoardingRecordResponseDTO> findHistoryByOwner(Long ownerId);

	List<BoardingRecordResponseDTO> findByDate(LocalDate from, LocalDate to);

	List<BoardingRecordResponseDTO> findMyCurrentBoarding(Long userId);

	List<BoardingRecordResponseDTO> findMyHistory(Long userId);

}