package training.javaweb.exam.dto.response;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OwnerDTO {

	private Long id;

	private String name;

	private String phone;

	private String email;

	private String address;

	private LocalDate createAt;

	public LocalDate getCreateAt() {
		return createAt;
	}

	public void setCreateAt(LocalDate createAt) {
		this.createAt = createAt;
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

	public OwnerDTO(Long id,
			@NotBlank(message = "Full name cannot be blank") @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") String fullName,
			@NotBlank(message = "Phone cannot be blank") @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Phone number is invalid") String phone,
			@Email(message = "Email format is invalid") String email,
			@NotBlank(message = "Address cannot be blank") String address) {
		super();
		this.id = id;
		this.name = fullName;
		this.phone = phone;
		this.email = email;
		this.address = address;
//		this.pets = pets;
	}

	public OwnerDTO() {
		super();
	}

}
