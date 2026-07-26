package training.javaweb.exam.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.request.BoardingRecordRequestDTO;
import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.entity.BoardingRecord;
import training.javaweb.exam.repository.BoardingRecordRepository;
import training.javaweb.exam.repository.CareNoteRepository;

@Service
public class BoardingRecordService {

	@Autowired
	private BoardingRecordRepository boardingRecordRepository;

	@Autowired
	private CareNoteRepository careNoteRepository;

	public BoardingRecordResponseDTO create(BoardingRecordRequestDTO dto) {
		boardingRecordRepository.insert(toEntity(dto));
		return toResponseFromRequest(dto);
	}

	public List<BoardingRecordResponseDTO> getAll() {
		return boardingRecordRepository.findAll();
	}

	// Chi tiết
	public BoardingRecordResponseDTO getDetail(Long id) {

		BoardingRecordResponseDTO response = boardingRecordRepository.findDetail(id);

		if (response == null) {
			return null;
		}

		response.setCareNote(careNoteRepository.findByBoardingId(id));

		return response;
	}

	public List<BoardingRecordResponseDTO> getCurrentBoarding() {
		return boardingRecordRepository.findCurrentBoarding();
	}

	public List<BoardingRecordResponseDTO> getHistoryByPet(Long petId) {
		return boardingRecordRepository.findHistoryByPet(petId);
	}

	public List<BoardingRecordResponseDTO> getHistoryByOwner(Long ownerId) {
		return boardingRecordRepository.findHistoryByOwner(ownerId);
	}

	public List<BoardingRecordResponseDTO> findByDate(LocalDate from, LocalDate to) {
		return boardingRecordRepository.findByDate(from, to);
	}

	public List<BoardingRecordResponseDTO> getMyCurrentBoarding(Long userId) {
		return boardingRecordRepository.findMyCurrentBoarding(userId);
	}

	public List<BoardingRecordResponseDTO> getMyHistory(Long userId) {
		return boardingRecordRepository.findMyHistory(userId);
	}
	public void checkOut(Long boardingId, LocalDate actualCheckOut) {
    BoardingRecordResponseDTO record = boardingRecordRepository.findDetail(boardingId);
    if (record == null) {
        throw new RuntimeException("Boarding record not found");
    }
    
    long actualDays = ChronoUnit.DAYS.between(record.getCheckInDate(), actualCheckOut);
    long expectedDays = ChronoUnit.DAYS.between(record.getCheckInDate(), record.getExpectedReturn());
    
    System.out.println(">>> expectedDays: " + expectedDays); // In ra số ngày dự kiến
    
    long lateFee = 0;
    if (actualDays > expectedDays) {
        lateFee = (long) ((actualDays - expectedDays) * record.getPricePerDay() * 20 / 100);
    }
    
    long baseFee = record.getBaseFee() != null ? record.getBaseFee() : 0;
    long tempTotal = baseFee + lateFee;
    
    long discount = 0;
    if (expectedDays > 7 && expectedDays < 10 || actualDays > 7 && actualDays < 10) {
        discount = tempTotal * 5 / 100;
    } else if (expectedDays >= 10 || actualDays >= 10) {
        discount = tempTotal * 10 / 100;
    }
    
    System.out.println(">>> discount tính được: " + discount); // In ra tiền giảm giá
    
    long totalFee = tempTotal - discount;
    
    BoardingRecord entity = new BoardingRecord();
    entity.setId(boardingId);
    entity.setActualCheckOut(actualCheckOut);
    entity.setLateFee(lateFee);
    entity.setDiscount(discount);
    entity.setTotalFee(totalFee);
    boardingRecordRepository.checkOut(entity);
}

	public Map<String, Object> getBoardingRecords(int page, int size, String status, String keyword) {
		int offset = page * size;
		List<BoardingRecord> content = boardingRecordRepository.findWithPaginationAndFilter(status, keyword, offset,
				size);
		long totalElements = boardingRecordRepository.countWithFilter(status, keyword);
		long totalPages = (long) Math.ceil((double) totalElements / size);
		Map<String, Object> response = new HashMap<>();
		response.put("content", content);
		response.put("totalElements", totalElements);
		response.put("totalPages", totalPages);
		response.put("currentPage", page);

		return response;
	}

	public BoardingRecord toEntity(BoardingRecordRequestDTO dto) {
		if (dto == null)
			return null;
		BoardingRecord record = new BoardingRecord();
		record.setPetId(dto.getPetId());
		record.setCheckInDate(dto.getCheckInDate());
		record.setExpectedReturn(dto.getExpectedReturn());
		record.setBaseFee(dto.getBaseFee());
		record.setNotes(dto.getNotes());
		record.setStatus("BOARDING");
		record.setPricePerDay(dto.getPricePerDay());
		return record;
	}

	public BoardingRecordResponseDTO toResponse(BoardingRecord record) {
		BoardingRecordResponseDTO newResponse = new BoardingRecordResponseDTO();
		newResponse.setPetId(record.getPetId());
		newResponse.setCheckInDate(record.getCheckInDate());
		newResponse.setExpectedReturn(record.getExpectedReturn());
		newResponse.setActualCheckOut(record.getActualCheckOut());
		newResponse.setBaseFee(record.getBaseFee());
		newResponse.setPricePerDay(record.getPricePerDay());
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
		newResponse.setBaseFee(record.getBaseFee());
		newResponse.setPricePerDay(record.getPricePerDay());
		newResponse.setNotes(record.getNotes());
		newResponse.setStatus(record.getStatus());
		return newResponse;
	}
}