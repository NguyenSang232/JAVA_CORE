package training.javaweb.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import training.javaweb.exam.config.CustomUserDetails;
import training.javaweb.exam.dto.response.CareNoteResponseDTO;
import training.javaweb.exam.service.BoardingRecordService;
import training.javaweb.exam.service.CareNoteService;

@RestController
@RequestMapping("/api/care-notes")
@CrossOrigin("*")
@Tag(name = "CareNote Management", description = "API quản lý ghi chú")
public class CareNoteController {

	@Autowired
	private CareNoteService careNoteService;

	@Autowired
	private BoardingRecordService boardingRecordService;

	@PostMapping
	@Operation(summary = "D1 Add CareNote", description = "Tạo mới ghi chú")
	public ResponseEntity<String> create(@Valid @RequestBody CareNoteResponseDTO dto) {
		careNoteService.create(dto);
		return ResponseEntity.ok("Care note created successfully.");
	}

	@GetMapping()
	@Operation(summary = "Get All Note for Dashboard", description = "Lấy danh sách tất cả ghi chú")
	public ResponseEntity<List<CareNoteResponseDTO>> getAll() {
		return ResponseEntity.ok(careNoteService.getAll());
	}

	@GetMapping("/boarding/{boardingId}")
	@Operation(summary = "D2 Get all Notes of a BoardingRecord", description = "Xem danh sách ghi chú của một phiếu gửi (Kiểm tra quyền sở hữu nếu là Customer)")
	public ResponseEntity<?> getByBoardingId(@PathVariable Long boardingId,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
		if (!isAdmin) {
			boolean isOwnerOfBoarding = boardingRecordService.getHistoryByOwner(userDetails.getUserId()).stream()
					.anyMatch(record -> record.getId().equals(boardingId));
			if (!isOwnerOfBoarding) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body("Bạn không có quyền xem ghi chú của phiếu gửi này.");
			}
		}
		return ResponseEntity.ok(careNoteService.getByBoardingId(boardingId));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get Note by ID", description = "Lấy danh sách ghi chú theo id")
	public ResponseEntity<CareNoteResponseDTO> getById(@PathVariable Long id) {
		return ResponseEntity.ok(careNoteService.getById(id));
	}

	@GetMapping("/my")
	@Operation(summary = "Get my Notes", description = "Lấy danh sách ghi chú của tôi dựa vào thông tin đăng nhập hiện tại")
	public ResponseEntity<List<CareNoteResponseDTO>> getMyNotes(@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestParam Long boardingId) {

		Long userId = userDetails.getUserId();
		return ResponseEntity.ok(careNoteService.getMyNotes(userId, boardingId));
	}

}