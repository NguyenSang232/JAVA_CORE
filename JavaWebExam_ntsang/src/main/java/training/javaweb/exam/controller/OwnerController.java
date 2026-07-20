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

    // A1. Thêm chủ nuôi mới [role ADMIN]
    @PostMapping
    @Operation(summary = "A1 Create owner", description = "Tạo mới chủ nuôi")
    public ResponseEntity<OwnerDTO> create(@Valid @RequestBody OwnerRequestDTO dto) {
        OwnerDTO owner = ownerService.createOwner(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(owner);
    }

    // A2. Hiển thị danh sách [role ADMIN]
    @GetMapping
    @Operation(summary = "A2 Get all owners", description = "Lấy danh sách tất cả chủ nuôi")
    public ResponseEntity<?> getAllOwners() {
        return ResponseEntity.ok(ownerService.getAll());
    }

    // A3. Xem chi tiết (kèm danh sách thú cưng) [role ADMIN]
    @GetMapping("/{id}")
    @Operation(summary = "A3 Get owner details", description = "Lấy thông tin chi tiết chủ nuôi kèm danh sách thú cưng")
    public ResponseEntity<?> getOwnerById(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.getDetail(id));
    }

    // A4. Cập nhật thông tin [role ADMIN]
    @PutMapping("/{id}")
    @Operation(summary = "A4 Update owner", description = "Cập nhật thông tin chủ nuôi")
    public ResponseEntity<OwnerDTO> update(@PathVariable Long id, @Valid @RequestBody OwnerRequestDTO dto) {
        OwnerDTO owner = ownerService.update(id, dto);
        return ResponseEntity.ok(owner);
    }

    // A5. Tìm kiếm theo tên hoặc SĐT [role ADMIN]
    @GetMapping("/search")
    @Operation(summary = "A5 Search owners by phone or name", description = "Tìm kiếm chủ nuôi theo tên hoặc số điện thoại")
    public ResponseEntity<?> searchOwner(@RequestParam String keyword) {
        return ResponseEntity.ok(ownerService.search(keyword));
    }

    // A6. Tạo tài khoản Customer cho chủ nuôi [role ADMIN]
    // Logic: tạo User với ROLE_CUSTOMER, liên kết với Owner dựa vào ownerId
    @PostMapping("/{id}/create-account")
    @Operation(summary = "A6 Create customer account for owner", description = "Tạo tài khoản đăng nhập (ROLE_CUSTOMER) và liên kết với chủ nuôi")
    public ResponseEntity<?> createCustomerAccountForOwner(
            @PathVariable Long id, 
            @Valid @RequestBody OwnerRequestDTO accountDto) {
        
        ownerService.createOwner(accountDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Customer account created and linked successfully.");
    }

    // A7. Xóa chủ nuôi (Xóa mềm) [role ADMIN]
    @DeleteMapping("/{id}")
    @Operation(summary = "A7 Delete owner", description = "Xóa mềm chủ nuôi theo ID")
    public ResponseEntity<?> deleteOwner(@PathVariable Long id) {
        ownerService.delete(id);
        return ResponseEntity.ok("Owner deleted successfully.");
    }
}