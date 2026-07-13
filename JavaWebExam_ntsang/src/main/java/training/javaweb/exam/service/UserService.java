package training.javaweb.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.OwnerDTO;
import training.javaweb.exam.entity.User;
import training.javaweb.exam.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// Tìm theo username
	public User findUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	// Tìm theo id
	public User findById(Long id) {
		return userRepository.findById(id);
	}

	// Tạo tài khoản
	public void createUser(OwnerDTO ownerDTO) {

		User newUser = toUser(ownerDTO);

		userRepository.insert(newUser);
	}

	// Kiểm tra Owner đã có tài khoản chưa
	public int countByOwnerId(Long ownerId) {
		return userRepository.countByOwnerId(ownerId);
	}

	// Đổi mật khẩu
	public void updatePassword(Long id, String password) {

		String encodePassword = passwordEncoder.encode(password);

		userRepository.updatePassword(id, encodePassword);
	}

	// Khóa tài khoản
	public void disable(Long id) {
		userRepository.disable(id);
	}

	// Convert OwnerDTO -> User
	public User toUser(OwnerDTO ownerDTO) {

		User user = new User();

		user.setUsername(ownerDTO.getPhone());
		user.setPassword(passwordEncoder.encode(ownerDTO.getPassword()));
		user.setRole("ROLE_USER");

		return user;
	}

}