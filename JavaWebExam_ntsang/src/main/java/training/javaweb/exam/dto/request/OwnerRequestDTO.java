package training.javaweb.exam.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OwnerRequestDTO {

	@NotBlank(message = "Full name cannot be blank")
	@Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
	private String name;

	@NotBlank(message = "Phone cannot be blank")
	@Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "Phone number is invalid")
	private String phone;

	@Email(message = "Email format is invalid")
	private String email;

	@NotBlank(message = "Address cannot be blank")
	private String address;

	public OwnerRequestDTO() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
}