package training.javaweb.exam.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.BoardingRecordDTO;
import training.javaweb.exam.entity.BoardingRecord;
import training.javaweb.exam.repository.BoardingRecordRepository;

@Service
public class BoardingRecordService {

	@Autowired
	private BoardingRecordRepository boardingRecordRepository;

	// Check-in
	public void create(BoardingRecordDTO dto) {
		boardingRecordRepository.insert(toEntity(dto));
	}

	// Danh sách
	public List<BoardingRecordDTO> getAll() {
		return boardingRecordRepository.findAll();
	}

	// Chi tiết
	public BoardingRecordDTO getDetail(Long id) {
		return boardingRecordRepository.findDetail(id);
	}

	// Check-out
	public void checkout(Long id, BoardingRecordDTO dto) {
		BoardingRecord record = toEntity(dto);
		record.setId(id);
		boardingRecordRepository.checkout(record);
	}

	// Đang gửi
	public List<BoardingRecordDTO> getCurrentBoarding() {
		return boardingRecordRepository.findCurrentBoarding();
	}

	// Lịch sử theo thú cưng
	public List<BoardingRecordDTO> getHistoryByPet(Long petId) {
		return boardingRecordRepository.findHistoryByPet(petId);
	}

	// Lịch sử theo chủ nuôi
	public List<BoardingRecordDTO> getHistoryByOwner(Long ownerId) {
		return boardingRecordRepository.findHistoryByOwner(ownerId);
	}

	// Tìm theo ngày
	public List<BoardingRecordDTO> findByDate(LocalDate from, LocalDate to) {
		return boardingRecordRepository.findByDate(from, to);
	}

	// Chủ nuôi xem thú cưng đang gửi
	public List<BoardingRecordDTO> getMyCurrentBoarding(Long userId) {
		return boardingRecordRepository.findMyCurrentBoarding(userId);
	}

	// Chủ nuôi xem lịch sử
	public List<BoardingRecordDTO> getMyHistory(Long userId) {
		return boardingRecordRepository.findMyHistory(userId);
	}

	// DTO -> Entity
	public BoardingRecord toEntity(BoardingRecordDTO dto) {

		if (dto == null)
			return null;

		BoardingRecord record = new BoardingRecord();

		record.setId(dto.getId());
		record.setPetId(dto.getPetId());
		record.setCheckInDate(dto.getCheckInDate());
		// record.setCheckOutDate(dto.getCheckOutDate());
		// record.setPrice(dto.getPrice());
		record.setStatus(dto.getStatus());

		return record;
	}
}