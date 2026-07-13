package training.javaweb.exam.entity;

import java.time.LocalDateTime;

public class Pet {

	private Long id;

	private Long ownerId;

	private String name;

	private String type;

	private String breed;

	private Double weight;

	private Integer age;

	private String image;

	private String status;

	private Boolean deleted;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	public Pet() {
		super();
	}

	public Pet(Long id, Long ownerId, String name, String type, String breed, Double weight, Integer age, String image,
			String status, Boolean deleted, LocalDateTime createdAt, LocalDateTime updatedAt, Owner owner) {
		super();
		this.id = id;
		this.ownerId = ownerId;
		this.name = name;
		this.type = type;
		this.breed = breed;
		this.weight = weight;
		this.age = age;
		this.image = image;
		this.status = status;
		this.deleted = deleted;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.owner = owner;
	}

	private Owner owner;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getBreed() {
		return breed;
	}

	public void setBreed(String breed) {
		this.breed = breed;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
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

	public Owner getOwner() {
		return owner;
	}

	public void setOwner(Owner owner) {
		this.owner = owner;
	}

}