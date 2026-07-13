package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import training.javaweb.exam.dto.CareNoteDTO;
import training.javaweb.exam.service.CareNoteService;

@RestController
@RequestMapping("/api/care-notes")
@CrossOrigin("*")
public class CareNoteController {

	@Autowired
	private CareNoteService careNoteService;

	// Create
	@PostMapping
	public ResponseEntity<?> create(@Valid @RequestBody CareNoteDTO dto,
			BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}

		careNoteService.create(dto);
		return ResponseEntity.ok("Care note created successfully.");
	}

	// Get Notes By Boarding
	@GetMapping("/boarding/{boardingId}")
	public ResponseEntity<?> getByBoardingId(@PathVariable Long boardingId) {

		return ResponseEntity.ok(careNoteService.getByBoardingId(boardingId));
	}

	// Get My Notes
	@GetMapping("/my-notes")
	public ResponseEntity<?> getMyNotes(@RequestParam Long userId,
			@RequestParam Long boardingId) {

		return ResponseEntity.ok(careNoteService.getMyNotes(userId, boardingId));
	}

	// Update
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id,
			@Valid @RequestBody CareNoteDTO dto,
			BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}

		careNoteService.update(id, dto);
		return ResponseEntity.ok("Care note updated successfully.");
	}

	// Delete
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {

		careNoteService.delete(id);
		return ResponseEntity.ok("Care note deleted successfully.");
	}
}