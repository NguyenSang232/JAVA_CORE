package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.request.PetRequestDTO;
import training.javaweb.exam.dto.response.PetResponseDTO;
import training.javaweb.exam.entity.Pet;
import training.javaweb.exam.repository.PetRepository;

@Service
public class PetService {

	@Autowired
	private PetRepository petRepository;

	public PetResponseDTO create(PetRequestDTO request) {
		Pet pet = new Pet();
		BeanUtils.copyProperties(request, pet);
		pet.setDeletedAt(false);
		petRepository.insert(pet);
		return petRepository.findDetail(pet.getId());
	}

	public List<PetResponseDTO> findAll() {
		return petRepository.findAll();
	}

	public PetResponseDTO findDetail(Long id) {
		return petRepository.findDetail(id);
	}

	public PetResponseDTO update(Long id, PetRequestDTO request) {
		Pet pet = new Pet();
		BeanUtils.copyProperties(request, pet);
		pet.setId(id);
		petRepository.update(pet);
		return petRepository.findDetail(id);
	}

	public void delete(Long id) {
		petRepository.softDelete(id);
	}

	public List<PetResponseDTO> findByType(String type) {
		return petRepository.findByType(type);
	}

	public List<PetResponseDTO> findByOwnerId(Long ownerId) {
		return petRepository.findByOwnerId(ownerId);
	}

	public List<PetResponseDTO> findMyPets(Long userId) {
		return petRepository.findMyPets(userId);
	}

	public void updateStatus(Long id, String status) {
		petRepository.updateStatus(id, status);
	}

}