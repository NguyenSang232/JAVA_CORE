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

	public User findUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	public void createUser(OwnerDTO ownerDTO) {
		User newUser = toUser(ownerDTO);
		userRepository.insert(newUser);
	}

	public User toUser(OwnerDTO ownerDTO) {
		User toUser = new User();
		toUser.setUsername(ownerDTO.getPhone());
		toUser.setPassword(passwordEncoder.encode(ownerDTO.getPassword()));
		toUser.setRole("ROLE_USER");
		return toUser;
	}
}
