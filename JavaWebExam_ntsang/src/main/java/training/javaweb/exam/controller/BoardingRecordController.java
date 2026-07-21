package training.javaweb.exam.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import training.javaweb.exam.config.CustomUserDetails;
import training.javaweb.exam.dto.request.BoardingRecordRequestDTO;
import training.javaweb.exam.dto.request.CheckOutRequestDTO;
import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.service.BoardingRecordService;

@RestController
@RequestMapping("/api/boarding-records")
@CrossOrigin("*")
@Tag(name = "Boarding Record Management", description = "API quản lý phiếu gửi")
public class BoardingRecordController {

	@Autowired
	private BoardingRecordService boardingRecordService;

	@PostMapping
	@Operation(summary = "C1 Create boarding record", description = "Tạo mới phiếu gửi")
	public ResponseEntity<BoardingRecordResponseDTO> create(@Valid @RequestBody BoardingRecordRequestDTO dto) {
		return ResponseEntity.ok(boardingRecordService.create(dto));
	}

	@GetMapping
	@Operation(summary = "C2 Get all boarding record", description = "Lấy danh sách tất cả phiếu gửi")
	public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(boardingRecordService.getAll());
	}

	@GetMapping("/{id}")
	@Operation(summary = "C3 Get detail boarding record", description = "Lấy chi tiết phiếu gửi")
	public ResponseEntity<?> getDetail(@PathVariable Long id) {
		return ResponseEntity.ok(boardingRecordService.getDetail(id));
	}

	@PutMapping("/checkout/{id}")
	@Operation(summary = "C4 Checkout boarding record", description = "Checkout để nhận thú cưng")
	public ResponseEntity<BoardingRecordResponseDTO> checkOut(@PathVariable Long id,
			@RequestBody CheckOutRequestDTO request) {
		boardingRecordService.checkOut(id, request.getActualCheckOut());
		BoardingRecordResponseDTO response = boardingRecordService.getDetail(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/current")
	@Operation(summary = "C5 Get all current boarding", description = "Lấy danh sách tất cả phiếu gửi đang gửi")
	public ResponseEntity<?> currentBoarding() {
		return ResponseEntity.ok(boardingRecordService.getCurrentBoarding());
	}

	@GetMapping("/pet/{petId}")
	@Operation(summary = "C6 Get all boarding record by Pets", description = "Lấy danh sách lịch sử phiếu gửi theo thú cưng")
	public ResponseEntity<?> historyByPet(@PathVariable Long petId) {
		return ResponseEntity.ok(boardingRecordService.getHistoryByPet(petId));
	}

	@GetMapping("/owner/{ownerId}")
	@Operation(summary = "C7 Get all boarding record by Owners", description = "Lấy danh sách lịch sử phiếu gửi theo chủ nuôi")
	public ResponseEntity<?> historyByOwner(@PathVariable Long ownerId) {
		return ResponseEntity.ok(boardingRecordService.getHistoryByOwner(ownerId));
	}

	@GetMapping("/date")
	@Operation(summary = "C8 Get all boarding record by Date", description = "Lấy danh sách tất cả phiếu gửi theo khung thời gian")
	public ResponseEntity<?> findByDate(@RequestParam LocalDate from, @RequestParam LocalDate to) {
		return ResponseEntity.ok(boardingRecordService.findByDate(from, to));
	}

	@GetMapping("/my-current")
	@Operation(summary = "C9 Get my current boarding", description = "Lấy danh sách phiếu đang gửi của tôi dựa vào tài khoản đăng nhập")
	public ResponseEntity<?> myCurrent(@AuthenticationPrincipal CustomUserDetails userDetails) {
		Long userId = userDetails.getUserId();
		return ResponseEntity.ok(boardingRecordService.getMyCurrentBoarding(userId));
	}

	@GetMapping("/my-history")
	@Operation(summary = "C10 Get my history boarding", description = "Lấy danh sách lịch sử phiếu gửi của tôi dựa vào tài khoản đăng nhập")
	public ResponseEntity<?> myHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
		Long userId = userDetails.getUserId();
		return ResponseEntity.ok(boardingRecordService.getMyHistory(userId));
	}
}