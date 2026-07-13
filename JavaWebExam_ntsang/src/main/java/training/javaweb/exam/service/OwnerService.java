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

	public void createOwner(OwnerDTO ownerDto) {
		Owner newOwner = toEntity(ownerDto);
		ownerRepository.insert(newOwner);
	}

	public List<OwnerDTO> getAll() {
		return ownerRepository.findAll();
	}

	// Pet Entity->PetDTO
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
//		if (owner.getPets() != null) {
//			dto.setPets(owner.getPets().stream().map(this::convertPetToDTO).collect(Collectors.toList()));
//		}
		return dto;
	}

	// DTO -> Entity
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
