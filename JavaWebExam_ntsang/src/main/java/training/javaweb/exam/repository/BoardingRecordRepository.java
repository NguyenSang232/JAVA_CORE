package training.javaweb.exam.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.entity.BoardingRecord;
import training.javaweb.exam.mapper.BoardingRecordMapper;

@Repository
public class BoardingRecordRepository {

	@Autowired
	private BoardingRecordMapper mapper;

	public void insert(BoardingRecord record) {
		mapper.insert(record);
	}

	public List<BoardingRecordResponseDTO> findAll() {
		return mapper.findAll();
	}

	public BoardingRecordResponseDTO findDetail(Long id) {
		return mapper.findDetail(id);
	}

	public List<BoardingRecordResponseDTO> findCurrentBoarding() {
		return mapper.findCurrentBoarding();
	}

	public List<BoardingRecordResponseDTO> findHistoryByPet(Long petId) {
		return mapper.findHistoryByPet(petId);
	}

	public List<BoardingRecordResponseDTO> findHistoryByOwner(Long ownerId) {
		return mapper.findHistoryByOwner(ownerId);
	}

	public List<BoardingRecordResponseDTO> findByDate(LocalDate from, LocalDate to) {
		return mapper.findByDate(from, to);
	}

	public List<BoardingRecordResponseDTO> findMyCurrentBoarding(Long userId) {
		return mapper.findMyCurrentBoarding(userId);
	}

	public List<BoardingRecordResponseDTO> findMyHistory(Long userId) {
		return mapper.findMyHistory(userId);
	}

}