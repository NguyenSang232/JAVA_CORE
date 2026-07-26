package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import training.javaweb.exam.dto.request.OwnerRequestDTO;
import training.javaweb.exam.dto.response.OwnerDTO;
import training.javaweb.exam.service.OwnerService;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
@Tag(name = "Owner Management", description = "API quản lý người chủ nuôi")
public class OwnerController {

	@Autowired
	private OwnerService ownerService;

	@PostMapping
	@Operation(summary = "A1 Create pets", description = "Tạo mới thú cưng")
	public ResponseEntity<OwnerDTO> create(@Valid @RequestBody OwnerRequestDTO dto) {

		OwnerDTO owner = ownerService.createOwner(dto);

		return ResponseEntity.status(HttpStatus.CREATED).body(owner);
	}

	@PutMapping("/{id}")
	@Operation(summary = "A4 Update owners", description = "Cập nhật thông tin người dùng")
	public ResponseEntity<OwnerDTO> update(@PathVariable Long id, @Valid @RequestBody OwnerRequestDTO dto) {

		OwnerDTO owner = ownerService.update(id, dto);
		return ResponseEntity.ok(owner);
	}

	@GetMapping
	@Operation(summary = "A2 Get all owners", description = "Lấy danh sách tất cả người dùng")
	public ResponseEntity<?> getAllOwners() {
		return ResponseEntity.ok(ownerService.getAll());
	}

	@GetMapping("/{id}")
	@Operation(summary = "A3 Get details owners", description = "Lấy thông tin chi tiết người dùng")
	public ResponseEntity<?> getOwnerById(@PathVariable Long id) {
		return ResponseEntity.ok(ownerService.getDetail(id));
	}

	@GetMapping("/search")
	@Operation(summary = "A5 Search owners by phone or name", description = "Tìm kiếm người dùng")
	public ResponseEntity<?> searchOwner(@RequestParam String keyword) {
		return ResponseEntity.ok(ownerService.search(keyword));
	}

	@PostMapping("/{id}/create-account")
	@Operation(summary = "A6 Create customer account for owner", description = "Tạo tài khoản đăng nhập (ROLE_CUSTOMER) và liên kết với chủ nuôi")
	public ResponseEntity<?> createCustomerAccountForOwner(@PathVariable Long id,
			@Valid @RequestBody OwnerRequestDTO accountDto) {

		ownerService.createOwner(accountDto);
		return ResponseEntity.status(HttpStatus.CREATED).body("Customer account created and linked successfully.");
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "A7 Delete owners", description = "Xóa người dùng")
	public ResponseEntity<?> deleteOwner(@PathVariable Long id) {
		ownerService.delete(id);
		return ResponseEntity.ok("Owner deleted successfully.");
	}

	@PutMapping("/restore")
    @Operation(summary = "Restore owners", description = "Khôi phục người dùng")
    public ResponseEntity<String> restoreOwner(@RequestParam("id") Long id) {
        try {
            boolean isRestored = ownerService.restoreOwner(id);
            if (isRestored) {
                return ResponseEntity.ok("Khôi phục chủ nuôi thành công!");
            } else {
                return ResponseEntity.badRequest().body("Không tìm thấy chủ nuôi hoặc khôi phục thất bại");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi máy chủ: " + e.getMessage());
        }
    }
}