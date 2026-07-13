package training.javaweb.exam.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import training.javaweb.exam.entity.User;

@Mapper
public interface UserMapper {

	User findByUsername(@Param("username") String username);

	void insert(User user);

	int countByOwnerId(Long ownerId);

	void updatePassword(Long id, String password);

	void disable(Long id);

	User findById(Long id);

}