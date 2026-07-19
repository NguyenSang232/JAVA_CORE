package training.javaweb.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@Transactional // BẮT BUỘC: Đảm bảo dữ liệu được commit đồng bộ
    public UserResponseDTO create(UserRequestDTO dto) {
        User user = toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true);
        
        // Kiểm tra xem dữ liệu ownerId truyền từ JS xuống đã có chưa
        if (dto.getOwnerId() == null) {
            throw new IllegalArgumentException("ownerId không được để trống!");
        }
        user.setOwnerId(dto.getOwnerId()); // Đảm bảo trường owner_id được gán trọn vẹn
        
        // Thực hiện chèn vào DB. MyBatis tự sinh id của USER (ví dụ sinh ra id = 1)
        userRepository.insert(user); 
        return toDTO(user); 
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
	 public UserResponseDTO findByOwnerId(Long ownerId) {
		User getOnwer = userRepository.findByOwnerId(ownerId);
		return toDTO(getOnwer);
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