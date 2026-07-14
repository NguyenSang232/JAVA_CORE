package training.javaweb.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import training.javaweb.exam.dto.request.PetRequestDTO;
import training.javaweb.exam.dto.response.PetResponseDTO;
import training.javaweb.exam.service.PetService;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin("*")
@Tag(name = "Pet Management", description = "API quản lý thú cưng")
public class PetController {

	@Autowired
	private PetService petService;

	@GetMapping
	@Operation(summary = "B2 Get all pets", description = "Lấy danh sách tất cả thú cưng")
	public ResponseEntity<List<PetResponseDTO>> findAll() {

		return ResponseEntity.ok(petService.findAll());
	}

	@GetMapping("/{id}")
	@Operation(summary = "B3 Get pet by id", description = "Lấy thông tin chi tiết thú cưng theo ID")
	public ResponseEntity<PetResponseDTO> findDetail(@PathVariable Long id) {

		return ResponseEntity.ok(petService.findDetail(id));
	}

	@PostMapping
	@Operation(summary = "B1 Create pet", description = "Tạo mới thông tin thú cưng")
	public ResponseEntity<PetResponseDTO> create(@Valid @RequestBody PetRequestDTO request) {

		return ResponseEntity.ok(petService.create(request));
	}

	@PutMapping("/{id}")
	@Operation(summary = "B4 Update pet", description = "Cập nhật thông tin thú cưng")
	public ResponseEntity<PetResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PetRequestDTO request) {

		petService.update(id, request);

		return ResponseEntity.ok(petService.findDetail(id));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "B5 Delete pet", description = "Xóa mềm thú cưng theo ID")
	public ResponseEntity<String> delete(@PathVariable Long id) {

		petService.delete(id);

		return ResponseEntity.ok("Delete pet success");
	}

	@GetMapping("/type/{type}")
	@Operation(summary = "B6 Find pet by type", description = "Tìm thú cưng theo loại (Dog, Cat...)")
	public ResponseEntity<List<PetResponseDTO>> findByType(@PathVariable String type) {

		return ResponseEntity.ok(petService.findByType(type));
	}

	@GetMapping("/owner/{ownerId}")
	@Operation(summary = "B7 Find pets by owner", description = "Lấy danh sách thú cưng của chủ nuôi")
	public ResponseEntity<List<PetResponseDTO>> findByOwner(@PathVariable Long ownerId) {

		return ResponseEntity.ok(petService.findByOwnerId(ownerId));
	}

	@GetMapping("/my/{userId}")
	@Operation(summary = "B8 Get user's pets", description = "Lấy danh sách thú cưng của người dùng hiện tại")
	public ResponseEntity<List<PetResponseDTO>> findMyPets(@PathVariable Long userId) {
		return ResponseEntity.ok(petService.findMyPets(userId));
	}
}