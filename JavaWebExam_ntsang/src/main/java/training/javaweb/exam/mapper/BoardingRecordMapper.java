package training.javaweb.exam.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.BoardingRecordDTO;
import training.javaweb.exam.entity.BoardingRecord;

@Mapper
public interface BoardingRecordMapper {

	void insert(BoardingRecord record);

	List<BoardingRecordDTO> findAll();

	BoardingRecordDTO findDetail(Long id);

	void checkout(BoardingRecord record);

	List<BoardingRecordDTO> findCurrentBoarding();

	List<BoardingRecordDTO> findHistoryByPet(Long petId);

	List<BoardingRecordDTO> findHistoryByOwner(Long ownerId);

	List<BoardingRecordDTO> findByDate(LocalDate from, LocalDate to);

	List<BoardingRecordDTO> findMyCurrentBoarding(Long userId);

	List<BoardingRecordDTO> findMyHistory(Long userId);

}