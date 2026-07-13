package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import training.javaweb.exam.dto.OwnerDTO;
import training.javaweb.exam.service.OwnerService;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

	@Autowired
	private OwnerService ownerService;

	@PostMapping()
	public ResponseEntity<?> createUser(@Valid @RequestBody OwnerDTO ownerDTO, BindingResult result) {

		if (result.hasErrors()) {
			return ResponseEntity.badRequest().body(result.getFieldErrors());
		}
		ownerService.createOwner(ownerDTO);
		return ResponseEntity.ok(ownerDTO);
	}

	@GetMapping()
	public ResponseEntity<?> getAllOwner() {
		ownerService.getAll();
		return ResponseEntity.ok(ownerService.getAll());
	}
}
