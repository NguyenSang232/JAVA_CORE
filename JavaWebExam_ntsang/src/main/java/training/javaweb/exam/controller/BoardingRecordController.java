package training.javaweb.exam.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import training.javaweb.exam.dto.BoardingRecordDTO;
import training.javaweb.exam.service.BoardingRecordService;

@RestController
@RequestMapping("/api/boarding-records")
@CrossOrigin("*")
public class BoardingRecordController {

	@Autowired
	private BoardingRecordService boardingRecordService;

	// Check-in
	@PostMapping
	public ResponseEntity<?> create(@Valid @RequestBody BoardingRecordDTO dto,
			BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}

		boardingRecordService.create(dto);
		return ResponseEntity.ok("Check in successfully.");
	}

	// Danh sách
	@GetMapping
	public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(boardingRecordService.getAll());
	}

	// Chi tiết
	@GetMapping("/{id}")
	public ResponseEntity<?> getDetail(@PathVariable Long id) {
		return ResponseEntity.ok(boardingRecordService.getDetail(id));
	}

	// Check-out
	@PutMapping("/{id}/checkout")
	public ResponseEntity<?> checkout(@PathVariable Long id,
			@RequestBody BoardingRecordDTO dto) {

		boardingRecordService.checkout(id, dto);

		return ResponseEntity.ok("Check out successfully.");
	}

	// Đang gửi
	@GetMapping("/current")
	public ResponseEntity<?> currentBoarding() {
		return ResponseEntity.ok(boardingRecordService.getCurrentBoarding());
	}

	// Lịch sử theo Pet
	@GetMapping("/pet/{petId}")
	public ResponseEntity<?> historyByPet(@PathVariable Long petId) {

		return ResponseEntity.ok(boardingRecordService.getHistoryByPet(petId));
	}

	// Lịch sử theo Owner
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<?> historyByOwner(@PathVariable Long ownerId) {

		return ResponseEntity.ok(boardingRecordService.getHistoryByOwner(ownerId));
	}

	// Tìm theo ngày
	@GetMapping("/date")
	public ResponseEntity<?> findByDate(@RequestParam LocalDate from,
			@RequestParam LocalDate to) {

		return ResponseEntity.ok(boardingRecordService.findByDate(from, to));
	}

	// Chủ nuôi xem thú cưng đang gửi
	@GetMapping("/my-current/{userId}")
	public ResponseEntity<?> myCurrent(@PathVariable Long userId) {

		return ResponseEntity.ok(boardingRecordService.getMyCurrentBoarding(userId));
	}

	// Chủ nuôi xem lịch sử
	@GetMapping("/my-history/{userId}")
	public ResponseEntity<?> myHistory(@PathVariable Long userId) {

		return ResponseEntity.ok(boardingRecordService.getMyHistory(userId));
	}
}