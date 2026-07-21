package training.javaweb.exam.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.entity.User;
import training.javaweb.exam.mapper.UserMapper;

@Repository
public class UserRepository {

	@Autowired
	private UserMapper userMapper;

	public User findByUsername(String username) {
		System.out.println(userMapper.findByUsername(username));
		return userMapper.findByUsername(username);
	}

	public void insert(User user) {
		userMapper.insert(user);
	}

	public int countByOwnerId(Long ownerId) {
		return userMapper.countByOwnerId(ownerId);
	}

	public void updatePassword(Long id, String password) {
		userMapper.updatePassword(id, password);
	}

	public void disable(Long id) {
		userMapper.disable(id);
	}

	public User findById(Long id) {
		return userMapper.findById(id);
	}

}