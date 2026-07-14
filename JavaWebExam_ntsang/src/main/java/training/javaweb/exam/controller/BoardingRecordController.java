package training.javaweb.exam.controller;

import java.time.LocalDate;

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

import jakarta.validation.Valid;
import training.javaweb.exam.dto.request.BoardingRecordRequestDTO;
import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.service.BoardingRecordService;

@RestController
@RequestMapping("/api/boarding-records")
@CrossOrigin("*")
public class BoardingRecordController {

	@Autowired
	private BoardingRecordService boardingRecordService;

	@PostMapping
	public ResponseEntity<BoardingRecordResponseDTO> create(@Valid @RequestBody BoardingRecordRequestDTO dto) {
		return ResponseEntity.ok(boardingRecordService.create(dto));
	}

	@GetMapping
	public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(boardingRecordService.getAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDetail(@PathVariable Long id) {
		return ResponseEntity.ok(boardingRecordService.getDetail(id));
	}

	@GetMapping("/current")
	public ResponseEntity<?> currentBoarding() {
		return ResponseEntity.ok(boardingRecordService.getCurrentBoarding());
	}

	@GetMapping("/pet/{petId}")
	public ResponseEntity<?> historyByPet(@PathVariable Long petId) {
		return ResponseEntity.ok(boardingRecordService.getHistoryByPet(petId));
	}

	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<?> historyByOwner(@PathVariable Long ownerId) {
		return ResponseEntity.ok(boardingRecordService.getHistoryByOwner(ownerId));
	}

	@GetMapping("/date")
	public ResponseEntity<?> findByDate(@RequestParam LocalDate from, @RequestParam LocalDate to) {
		return ResponseEntity.ok(boardingRecordService.findByDate(from, to));
	}

	@GetMapping("/my-current/{userId}")
	public ResponseEntity<?> myCurrent(@PathVariable Long userId) {
		return ResponseEntity.ok(boardingRecordService.getMyCurrentBoarding(userId));
	}

	@GetMapping("/my-history/{userId}")
	public ResponseEntity<?> myHistory(@PathVariable Long userId) {
		return ResponseEntity.ok(boardingRecordService.getMyHistory(userId));
	}
}