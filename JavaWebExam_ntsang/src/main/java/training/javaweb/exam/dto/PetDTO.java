package training.javaweb.exam.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PetDTO {

	private Long id;

	@NotNull(message = "Owner ID cannot be null")
	private Long ownerId;

	@NotBlank(message = "Pet name cannot be blank")
	@Size(min = 2, max = 50, message = "Pet name must be between 2 and 50 characters")
	private String name;

	@NotBlank(message = "Pet type cannot be blank")
	private String type;

	@NotBlank(message = "Breed cannot be blank")
	private String breed;

	private Integer age;

	@NotNull(message = "Weight cannot be null")
	@DecimalMin(value = "0.1", message = "Weight must be greater than 0")
	private Double weight;

	private String image;

	public PetDTO() {
		super();
	}

	public PetDTO(Long id, @NotNull(message = "Owner ID cannot be null") Long ownerId,
			@NotBlank(message = "Pet name cannot be blank") @Size(min = 2, max = 50, message = "Pet name must be between 2 and 50 characters") String name,
			@NotBlank(message = "Pet type cannot be blank") String type,
			@NotBlank(message = "Breed cannot be blank") String breed, Integer age,
			@NotNull(message = "Weight cannot be null") @DecimalMin(value = "0.1", message = "Weight must be greater than 0") Double weight,
			String image) {
		super();
		this.id = id;
		this.ownerId = ownerId;
		this.name = name;
		this.type = type;
		this.breed = breed;
		this.age = age;
		this.weight = weight;
		this.image = image;
	}

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

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

}