package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.javaweb.exam.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

	@Autowired
	private UserService userService;

	// Lấy thông tin user
	@GetMapping("/{id}")
	public ResponseEntity<?> getUser(@PathVariable Long id) {

		return ResponseEntity.ok(userService.findById(id));
	}

	// Kiểm tra owner đã có account chưa
	@GetMapping("/count/{ownerId}")
	public ResponseEntity<?> countUser(@PathVariable Long ownerId) {

		return ResponseEntity.ok(userService.countByOwnerId(ownerId));
	}

	// Đổi mật khẩu
	@PutMapping("/{id}/password")
	public ResponseEntity<?> updatePassword(@PathVariable Long id,
			@RequestParam String password) {

		userService.updatePassword(id, password);

		return ResponseEntity.ok("Password updated successfully.");
	}

	// Khóa tài khoản
	@PutMapping("/{id}/disable")
	public ResponseEntity<?> disable(@PathVariable Long id) {

		userService.disable(id);

		return ResponseEntity.ok("User disabled successfully.");
	}

}