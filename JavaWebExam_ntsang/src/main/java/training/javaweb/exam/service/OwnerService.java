package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.request.OwnerRequestDTO;
import training.javaweb.exam.dto.response.OwnerDTO;
import training.javaweb.exam.entity.Owner;
import training.javaweb.exam.repository.OwnerRepository;
import training.javaweb.exam.repository.PetRepository;

@Service
public class OwnerService {

	@Autowired
	private OwnerRepository ownerRepository;

	@Autowired
	private PetRepository petRepository;

	public OwnerDTO createOwner(OwnerRequestDTO dto) {
		Owner owner = toEntity(dto);

		ownerRepository.insert(owner);

		return ownerRepository.findDTOById(owner.getId());
	}

	public OwnerDTO update(Long id, OwnerRequestDTO dto) {

		Owner owner = toEntity(dto);
		owner.setId(id);
		ownerRepository.update(owner);

		return ownerRepository.findDTOById(id);
	}

	public List<OwnerDTO> getAll() {
		return ownerRepository.findAll();
	}

	public OwnerDTO getDetail(Long id) {
		return ownerRepository.findDetail(id);
	}

	public OwnerDTO getById(Long id) {
		return ownerRepository.findDTOById(id);
	}

	public List<OwnerDTO> search(String keyword) {
		return ownerRepository.search(keyword);
	}

	public void delete(Long id) {
		ownerRepository.softDelete(id);
		petRepository.softDelete(id);
	}

	public boolean restoreOwner(Long id) {
        return ownerRepository.restoreOwner(id) > 0;
    }

	public Owner toEntity(OwnerRequestDTO dto) {
		if (dto == null) {
			return null;
		}
		Owner owner = new Owner();
		owner.setName(dto.getName());
		owner.setPhone(dto.getPhone());
		owner.setEmail(dto.getEmail());
		owner.setAddress(dto.getAddress());
		return owner;
	}

	// OwnerDTO -> Owner Entity
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
		dto.setCreateAt(owner.getCreatedAt());
		dto.setDeletedAt(owner.getDeleted());
		return dto;
	}

}