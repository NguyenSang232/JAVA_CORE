package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import training.javaweb.exam.dto.OwnerDTO;
import training.javaweb.exam.service.OwnerService;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

	@Autowired
	private OwnerService ownerService;

	// Create
	@PostMapping
	public ResponseEntity<?> createOwner(@Valid @RequestBody OwnerDTO ownerDTO,
			BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}

		ownerService.createOwner(ownerDTO);
		return ResponseEntity.ok("Owner created successfully.");
	}

	// Read All
	@GetMapping
	public ResponseEntity<?> getAllOwners() {
		return ResponseEntity.ok(ownerService.getAll());
	}

	// Read Detail
	@GetMapping("/{id}")
	public ResponseEntity<?> getOwnerById(@PathVariable Long id) {
		return ResponseEntity.ok(ownerService.getDetail(id));
	}

	// Update
	@PutMapping("/{id}")
	public ResponseEntity<?> updateOwner(@PathVariable Long id,
			@Valid @RequestBody OwnerDTO ownerDTO,
			BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}

		ownerService.update(id, ownerDTO);
		return ResponseEntity.ok("Owner updated successfully.");
	}

	// Search
	@GetMapping("/search")
	public ResponseEntity<?> searchOwner(@RequestParam String keyword) {
		return ResponseEntity.ok(ownerService.search(keyword));
	}

	// Delete (Soft Delete)
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteOwner(@PathVariable Long id) {
		ownerService.delete(id);
		return ResponseEntity.ok("Owner deleted successfully.");
	}
}