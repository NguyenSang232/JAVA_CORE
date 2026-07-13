package training.javaweb.exam.entity;

import java.time.LocalDateTime;

public class User {

	private Long id;

	private String username;

	private String password;

	private String role;

	public User() {
		super();
	}

	public User(Long id, String username, String password, String role, Long ownerId, Boolean enabled,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.ownerId = ownerId;
		this.enabled = enabled;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// liên kết owner nếu là customer
	private Long ownerId;

	private Boolean enabled;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

}