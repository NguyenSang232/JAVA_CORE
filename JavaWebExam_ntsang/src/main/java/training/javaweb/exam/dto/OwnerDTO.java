package training.javaweb.exam.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OwnerDTO {

	private Long id;

	@NotBlank(message = "Full name cannot be blank")
	@Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
	private String name;

	@NotBlank(message = "Phone cannot be blank")
	@Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Phone number is invalid")
	private String phone;

	@Email(message = "Email format is invalid")
	private String email;

	@NotBlank(message = "Address cannot be blank")
	private String address;

	@Size(min = 6, max = 50, message = "Full name must be at least 6 characters")
	private String password;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
//	private List<PetDTO> pets;

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

//	public List<PetDTO> getPets() {
//		return pets;
//	}

//	public void setPets(List<PetDTO> pets) {
//		this.pets = pets;
//	}

	public OwnerDTO(Long id,
			@NotBlank(message = "Full name cannot be blank") @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") String fullName,
			@NotBlank(message = "Phone cannot be blank") @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Phone number is invalid") String phone,
			@Email(message = "Email format is invalid") String email,
			@NotBlank(message = "Address cannot be blank") String address, List<PetDTO> pets) {
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
