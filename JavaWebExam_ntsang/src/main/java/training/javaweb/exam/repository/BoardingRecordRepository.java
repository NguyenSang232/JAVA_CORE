package training.javaweb.exam.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.BoardingRecordDTO;
import training.javaweb.exam.entity.BoardingRecord;
import training.javaweb.exam.mapper.BoardingRecordMapper;

@Repository
public class BoardingRecordRepository {

	@Autowired
	private BoardingRecordMapper mapper;

	public void insert(BoardingRecord record) {
		mapper.insert(record);
	}

	public List<BoardingRecordDTO> findAll() {
		return mapper.findAll();
	}

	public BoardingRecordDTO findDetail(Long id) {
		return mapper.findDetail(id);
	}

	public void checkout(BoardingRecord record) {
		mapper.checkout(record);
	}

	public List<BoardingRecordDTO> findCurrentBoarding() {
		return mapper.findCurrentBoarding();
	}

	public List<BoardingRecordDTO> findHistoryByPet(Long petId) {
		return mapper.findHistoryByPet(petId);
	}

	public List<BoardingRecordDTO> findHistoryByOwner(Long ownerId) {
		return mapper.findHistoryByOwner(ownerId);
	}

	public List<BoardingRecordDTO> findByDate(LocalDate from, LocalDate to) {
		return mapper.findByDate(from, to);
	}

	public List<BoardingRecordDTO> findMyCurrentBoarding(Long userId) {
		return mapper.findMyCurrentBoarding(userId);
	}

	public List<BoardingRecordDTO> findMyHistory(Long userId) {
		return mapper.findMyHistory(userId);
	}

}