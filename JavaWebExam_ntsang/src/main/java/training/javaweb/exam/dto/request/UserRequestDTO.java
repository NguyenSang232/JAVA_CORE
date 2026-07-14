package training.javaweb.exam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserRequestDTO {

	@NotBlank(message = "Username cannot be blank")
	@Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
	private String username;

	@NotBlank(message = "Password cannot be blank")
	@Size(min = 6, max = 100, message = "Password must be at least 6 characters")
	private String password;

	@NotBlank(message = "Role cannot be blank")
	private String role;

	@NotNull(message = "Owner id is required")
	private Long ownerId;

	public UserRequestDTO() {
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

}