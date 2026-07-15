package training.javaweb.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import training.javaweb.exam.dto.response.CareNoteResponseDTO;
import training.javaweb.exam.service.CareNoteService;

@RestController
@RequestMapping("/api/care-notes")
@CrossOrigin("*")
@Tag(name = "CareNote Management", description = "API quản lý ghi chú")
public class CareNoteController {

	@Autowired
	private CareNoteService careNoteService;

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
	@Operation(summary = "D2 Get all Note of a BoardingRecord", description = "Xem danh sách chi tiết của một phiếu gửi")
	public ResponseEntity<List<CareNoteResponseDTO>> getByBoardingId(@PathVariable Long boardingId) {
		return ResponseEntity.ok(careNoteService.getByBoardingId(boardingId));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get Note by ID", description = "Lấy danh sách ghi chú theo id")
	public ResponseEntity<CareNoteResponseDTO> getById(@PathVariable Long id) {
		return ResponseEntity.ok(careNoteService.getById(id));
	}

	@GetMapping("/my")
	@Operation(summary = "Get my Note", description = "Lấy danh sách ghi chú của tui")
	public ResponseEntity<List<CareNoteResponseDTO>> getMyNotes(@RequestParam Long userId,
			@RequestParam Long boardingId) {
		return ResponseEntity.ok(careNoteService.getMyNotes(userId, boardingId));
	}

}