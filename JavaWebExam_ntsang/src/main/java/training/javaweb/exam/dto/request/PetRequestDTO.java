package training.javaweb.exam.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class PetRequestDTO {

	@NotNull(message = "Owner id is required")
	private Long ownerId;

	@NotBlank(message = "Pet name is required")
	@Size(min = 2, max = 50, message = "Pet name must be between 2 and 50 characters")
	private String name;

	@NotBlank(message = "Pet type is required")
	private String type;

	@NotBlank(message = "Breed is required")
	@Size(max = 50, message = "Breed max length is 50 characters")
	private String breed;

	@NotNull(message = "Weight is required")
	@Positive(message = "Weight must be greater than 0")
	private Double weight;

	@NotNull(message = "Age is required")
	@Min(value = 0, message = "Age cannot be negative")
	@Max(value = 50, message = "Age is invalid")
	private Integer age;

	private String image;

	public PetRequestDTO() {
		super();
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

}