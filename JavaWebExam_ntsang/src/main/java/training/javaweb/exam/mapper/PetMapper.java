package training.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.PetDTO;
import training.javaweb.exam.entity.Pet;

@Mapper
public interface PetMapper {
	void insert(Pet pet);

	List<PetDTO> findAll();

	PetDTO findDetail(Long id);

	void update(Pet pet);

	void softDelete(Long id);

	List<PetDTO> findByType(String type);

	List<PetDTO> findByOwnerId(Long ownerId);

	List<PetDTO> findMyPets(Long userId);

	void updateStatus(Long id, String status);
}