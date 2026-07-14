package training.javaweb.exam.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.response.PetResponseDTO;
import training.javaweb.exam.entity.Pet;
import training.javaweb.exam.mapper.PetMapper;

@Repository
public class PetRepository {

	@Autowired
	private PetMapper petMapper;

	public void insert(Pet pet) {

		petMapper.insert(pet);
	}

	public List<PetResponseDTO> findAll() {

		return petMapper.findAll();
	}

	public PetResponseDTO findDetail(Long id) {

		return petMapper.findDetail(id);
	}

	public void update(Pet pet) {

		petMapper.update(pet);
	}

	public void softDelete(Long id) {

		petMapper.softDelete(id);
	}

	public List<PetResponseDTO> findByType(String type) {

		return petMapper.findByType(type);
	}

	public List<PetResponseDTO> findByOwnerId(Long ownerId) {

		return petMapper.findByOwnerId(ownerId);
	}

	public List<PetResponseDTO> findMyPets(Long userId) {

		return petMapper.findMyPets(userId);
	}

	public void updateStatus(Long id, String status) {

		petMapper.updateStatus(id, status);
	}

}