package training.javaweb.exam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserDTO {

	private Long id;

	@NotBlank(message = "Username cannot be blank")
	@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
	private String username;

	@NotBlank(message = "Password cannot be blank")
	@Size(min = 6, message = "Password must have at least 6 characters")
	private String password;

	@NotBlank(message = "Role cannot be blank")
	private String role;

	private Long ownerId;

	@NotNull(message = "Enabled cannot be null")
	private Boolean enabled;

	public UserDTO() {
		super();
	}

	public UserDTO(Long id,
			@NotBlank(message = "Username cannot be blank") @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") String username,
			@NotBlank(message = "Password cannot be blank") @Size(min = 6, message = "Password must have at least 6 characters") String password,
			@NotBlank(message = "Role cannot be blank") String role, Long ownerId,
			@NotNull(message = "Enabled cannot be null") Boolean enabled) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.ownerId = ownerId;
		this.enabled = enabled;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

}