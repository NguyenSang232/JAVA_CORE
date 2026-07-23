package training.javaweb.exam.entity;

import java.time.LocalDate;
import java.util.List;

public class Owner {

	private Long id;

	private String name;

	private String phone;

	private String email;

	private String address;

	private Long userId;

	private Boolean deleted_at;

	private LocalDate createdAt;

	private LocalDate updatedAt;

	private List<Pet> pets;

	public Owner() {
		super();
	}

	public Owner(Long id, String fullName, String phone, String email, String address, Long userId, Boolean deleted,
			LocalDate createdAt, LocalDate updatedAt, List<Pet> pets) {
		super();
		this.id = id;
		this.name = fullName;
		this.phone = phone;
		this.email = email;
		this.address = address;
		this.userId = userId;
		this.deleted_at = deleted;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.pets = pets;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String fullName) {
		this.name = fullName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Boolean getDeleted() {
		return deleted_at;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted_at = deleted;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDate getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}

	public List<Pet> getPets() {
		return pets;
	}

	public void setPets(List<Pet> pets) {
		this.pets = pets;
	}

}