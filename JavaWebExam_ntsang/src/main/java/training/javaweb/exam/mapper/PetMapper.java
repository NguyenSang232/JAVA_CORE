package training.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import training.javaweb.exam.dto.response.PetResponseDTO;
import training.javaweb.exam.entity.Pet;

@Mapper
public interface PetMapper {
	void insert(Pet pet);

	List<PetResponseDTO> findAll();

	PetResponseDTO findDetail(Long id);

	void update(Pet pet);

	void softDelete(Long id);

	List<PetResponseDTO> findByType(String type);

	List<PetResponseDTO> findByOwnerId(Long ownerId);

	List<PetResponseDTO> findMyPets(Long userId);

	void updateStatus(Long id, String status);
}