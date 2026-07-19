package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import training.javaweb.exam.dto.request.UserRequestDTO;
import training.javaweb.exam.dto.response.UserResponseDTO;
import training.javaweb.exam.service.UserService;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "API quản lý người dùng")
public class UserController {
	@Autowired
	private UserService userService;

	@PostMapping
	@Operation(summary = " A6 Create user", description = "Tạo mới tài khoản người dùng")
	public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO dto) {
		UserResponseDTO response = userService.create(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get user by id", description = "Lấy thông tin chi tiết user theo ID")
	public ResponseEntity<UserResponseDTO> getById(
			@Parameter(description = "User ID", example = "1") @PathVariable Long id) {
		return ResponseEntity.ok(userService.getById(id));
	}

	@PutMapping("/{id}/password")
	@Operation(summary = "Update password", description = "Cập nhật mật khẩu user")
	public ResponseEntity<String> updatePassword(

			@Parameter(description = "User ID", example = "1") @PathVariable Long id,

			@Parameter(description = "New password", example = "123456") @RequestParam String password

	) {
		userService.updatePassword(id, password);
		return ResponseEntity.ok("Password updated successfully.");
	}

	@PutMapping("/{id}/disable")
	@Operation(summary = "Disable user", description = "Vô hiệu hóa tài khoản user")
	public ResponseEntity<String> disable(

			@Parameter(description = "User ID", example = "1") @PathVariable Long id

	) {

		userService.disable(id);

		return ResponseEntity.ok("User disabled successfully.");

	}
	@GetMapping("/owner/{ownerId}")
	@Operation(summary = "Get user by owner id", description = "Lấy tài khoản user theo ID chủ nuôi")
	public ResponseEntity<?> getUserByOwnerId(@PathVariable("ownerId") Long ownerId) { // ĐỔI THÀNH @PathVariable
		if (ownerId != null) {
			UserResponseDTO userResponse = userService.findByOwnerId(ownerId); 
			if (userResponse == null) {
				return ResponseEntity.noContent().build(); // Trả về 204 nếu không tìm thấy tài khoản
			}
			return ResponseEntity.ok(userResponse); // Trả về 200 kèm JSON chuẩn
		}
		return ResponseEntity.badRequest().body("Owner ID không được để trống");
	}
}