package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.OwnerDTO;
import training.javaweb.exam.dto.PetDTO;
import training.javaweb.exam.entity.Owner;
import training.javaweb.exam.entity.Pet;
import training.javaweb.exam.repository.OwnerRepository;

@Service
public class OwnerService {

	@Autowired
	private OwnerRepository ownerRepository;

	// Create
	public void createOwner(OwnerDTO ownerDto) {
		Owner newOwner = toEntity(ownerDto);
		ownerRepository.insert(newOwner);
	}

	// Read All
	public List<OwnerDTO> getAll() {
		return ownerRepository.findAll();
	}

	// Read Detail
	public OwnerDTO getDetail(Long id) {
		return ownerRepository.findDetail(id);
	}

	// Read By Id
	public OwnerDTO getById(Long id) {
		return ownerRepository.findDTOById(id);
	}

	// Update
	public void update(Long id, OwnerDTO ownerDto) {
		Owner owner = toEntity(ownerDto);
		owner.setId(id);
		ownerRepository.update(owner);
	}

	// Search
	public List<OwnerDTO> search(String keyword) {
		return ownerRepository.search(keyword);
	}

	// Delete (Soft Delete)
	public void delete(Long id) {
		ownerRepository.softDelete(id);
	}

	// ---------------------- Convert ----------------------

	// Pet Entity -> PetDTO
	private PetDTO convertPetToDTO(Pet pet) {
		if (pet == null) {
			return null;
		}

		PetDTO dto = new PetDTO();
		dto.setId(pet.getId());
		dto.setName(pet.getName());
		dto.setType(pet.getType());
		dto.setBreed(pet.getBreed());
		dto.setAge(pet.getAge());
		dto.setWeight(pet.getWeight());
		dto.setOwnerId(pet.getOwnerId());

		return dto;
	}

	// Owner Entity -> OwnerDTO
	public OwnerDTO toDTO(Owner owner) {
		if (owner == null) {
			return null;
		}

		OwnerDTO dto = new OwnerDTO();
		dto.setId(owner.getId());
		dto.setName(owner.getName());
		dto.setPhone(owner.getPhone());
		dto.setEmail(owner.getEmail());
		dto.setAddress(owner.getAddress());

		// Nếu Owner có List<Pet> thì mở phần này
//		if (owner.getPets() != null) {
//			dto.setPets(owner.getPets()
//					.stream()
//					.map(this::convertPetToDTO)
//					.toList());
//		}

		return dto;
	}

	// OwnerDTO -> Owner Entity
	public Owner toEntity(OwnerDTO dto) {
		if (dto == null) {
			return null;
		}

		Owner owner = new Owner();
		owner.setId(dto.getId());
		owner.setName(dto.getName());
		owner.setPhone(dto.getPhone());
		owner.setEmail(dto.getEmail());
		owner.setAddress(dto.getAddress());

		return owner;
	}

}