package training.javaweb.exam.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.request.BoardingRecordRequestDTO;
import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.entity.BoardingRecord;
import training.javaweb.exam.repository.BoardingRecordRepository;

@Service
public class BoardingRecordService {

	@Autowired
	private BoardingRecordRepository boardingRecordRepository;

	// Check-in
	public BoardingRecordResponseDTO create(BoardingRecordRequestDTO dto) {

		boardingRecordRepository.insert(toEntity(dto));

		return toResponseFromRequest(dto);
	}

	// Danh sách
	public List<BoardingRecordResponseDTO> getAll() {
		return boardingRecordRepository.findAll();
	}

	// Chi tiết
	public BoardingRecordResponseDTO getDetail(Long id) {
		return boardingRecordRepository.findDetail(id);
	}

	// Đang gửi
	public List<BoardingRecordResponseDTO> getCurrentBoarding() {
		return boardingRecordRepository.findCurrentBoarding();
	}

	// Lịch sử theo thú cưng
	public List<BoardingRecordResponseDTO> getHistoryByPet(Long petId) {
		return boardingRecordRepository.findHistoryByPet(petId);
	}

	// Lịch sử theo chủ nuôi
	public List<BoardingRecordResponseDTO> getHistoryByOwner(Long ownerId) {
		return boardingRecordRepository.findHistoryByOwner(ownerId);
	}

	// Tìm theo ngày
	public List<BoardingRecordResponseDTO> findByDate(LocalDate from, LocalDate to) {
		return boardingRecordRepository.findByDate(from, to);
	}

	// Chủ nuôi xem thú cưng đang gửi
	public List<BoardingRecordResponseDTO> getMyCurrentBoarding(Long userId) {
		return boardingRecordRepository.findMyCurrentBoarding(userId);
	}

	// Chủ nuôi xem lịch sử
	public List<BoardingRecordResponseDTO> getMyHistory(Long userId) {
		return boardingRecordRepository.findMyHistory(userId);
	}

	// DTO -> Entity
	public BoardingRecord toEntity(BoardingRecordRequestDTO dto) {
		if (dto == null)
			return null;
		BoardingRecord record = new BoardingRecord();
		record.setPetId(dto.getPetId());
		record.setCheckInDate(dto.getCheckInDate());
		record.setExpectedReturn(dto.getExpectedReturn());
		record.setBaseFee(dto.getBaseFee());
		record.setLateFee(dto.getLateFee());
		record.setPricePerDay(dto.getPricePerDay());
		record.setTotalFee(dto.getTotalFee());
		record.setNotes(dto.getNotes());
		record.setStatus("BOARDING");
		return record;
	}

	public BoardingRecordResponseDTO toResponse(BoardingRecord record) {
		BoardingRecordResponseDTO newResponse = new BoardingRecordResponseDTO();
		newResponse.setPetId(record.getPetId());
		newResponse.setCheckInDate(record.getCheckInDate());
		newResponse.setExpectedReturn(record.getExpectedReturn());
		newResponse.setActualCheckOut(record.getActualCheckOut());
		newResponse.setPricePerDay(record.getPricePerDay());
		newResponse.setBaseFee(record.getBaseFee());
		newResponse.setTotalFee(record.getTotalFee());
		newResponse.setLateFee(record.getLateFee());
		newResponse.setNotes(record.getNotes());
		return newResponse;
	}

	public BoardingRecordResponseDTO toResponseFromRequest(BoardingRecordRequestDTO record) {
		BoardingRecordResponseDTO newResponse = new BoardingRecordResponseDTO();
		newResponse.setPetId(record.getPetId());
		newResponse.setCheckInDate(record.getCheckInDate());
		newResponse.setExpectedReturn(record.getExpectedReturn());
		newResponse.setPricePerDay(record.getPricePerDay());
		newResponse.setBaseFee(record.getBaseFee());
		newResponse.setLateFee(record.getLateFee());
		newResponse.setNotes(record.getNotes());
		newResponse.setTotalFee(record.getTotalFee());
		newResponse.setStatus(record.getStatus());
		return newResponse;
	}
}