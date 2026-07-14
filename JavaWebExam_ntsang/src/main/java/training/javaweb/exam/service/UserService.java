package training.javaweb.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.request.UserRequestDTO;
import training.javaweb.exam.dto.response.UserResponseDTO;
import training.javaweb.exam.entity.User;
import training.javaweb.exam.exception.ResourceNotFoundException;
import training.javaweb.exam.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// ==================== Create ====================
	public UserResponseDTO create(UserRequestDTO dto) {
		User user = toEntity(dto);
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setEnabled(true);
		userRepository.insert(user);
		return toDTO(userRepository.findById(user.getId()));
	}

	// ==================== Get By Id ====================
	public UserResponseDTO getById(Long id) {
		User user = userRepository.findById(id);
		if (user == null) {
			throw new ResourceNotFoundException("User not found with id: " + id);
		}
		return toDTO(user);
	}

	// ==================== Find Username ====================
	public User findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	// ==================== Check Owner ====================
	public boolean hasAccount(Long ownerId) {
		return userRepository.countByOwnerId(ownerId) > 0;
	}

	// ==================== Update Password ====================
	public void updatePassword(Long id, String password) {
		User user = userRepository.findById(id);
		if (user == null) {
			throw new ResourceNotFoundException("User not found with id: " + id);
		}
		userRepository.updatePassword(id, passwordEncoder.encode(password));
	}

	// ==================== Disable ====================
	public void disable(Long id) {
		User user = userRepository.findById(id);
		if (user == null) {
			throw new ResourceNotFoundException("User not found with id: " + id);
		}
		userRepository.disable(id);
	}

	// ==================== Convert ====================
	private User toEntity(UserRequestDTO dto) {
		User user = new User();
		user.setUsername(dto.getUsername());
		user.setPassword(dto.getPassword());
		user.setRole(dto.getRole());
		user.setOwnerId(dto.getOwnerId());
		return user;
	}

	private UserResponseDTO toDTO(User user) {
		UserResponseDTO dto = new UserResponseDTO();
		dto.setId(user.getId());
		dto.setUsername(user.getUsername());
		dto.setRole(user.getRole());
		dto.setOwnerId(user.getOwnerId());
		dto.setEnabled(user.getEnabled());
		dto.setCreatedAt(user.getCreatedAt());
		dto.setUpdatedAt(user.getUpdatedAt());
		return dto;
	}
}