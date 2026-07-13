package training.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.javaweb.exam.dto.PetDTO;
import training.javaweb.exam.entity.Pet;
import training.javaweb.exam.repository.PetRepository;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public void createPet(PetDTO dto) {
        petRepository.insert(toEntity(dto));
    }

    public List<PetDTO> getAll() {
        return petRepository.findAll();
    }

    public PetDTO getDetail(Long id) {
        return petRepository.findDetail(id);
    }

    public void update(Long id, PetDTO dto) {
        Pet pet = toEntity(dto);
        pet.setId(id);
        petRepository.update(pet);
    }

    public void delete(Long id) {
        petRepository.softDelete(id);
    }

    public List<PetDTO> findByType(String type) {
        return petRepository.findByType(type);
    }

    public List<PetDTO> findByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public List<PetDTO> findMyPets(Long userId) {
        return petRepository.findMyPets(userId);
    }

    public void updateStatus(Long id, String status) {
        petRepository.updateStatus(id, status);
    }

    // DTO -> Entity
    public Pet toEntity(PetDTO dto) {
        if (dto == null) return null;

        Pet pet = new Pet();
        pet.setId(dto.getId());
        pet.setName(dto.getName());
        pet.setType(dto.getType());
        pet.setBreed(dto.getBreed());
        pet.setAge(dto.getAge());
        pet.setWeight(dto.getWeight());
        pet.setOwnerId(dto.getOwnerId());

        return pet;
    }

    // Entity -> DTO
    public PetDTO toDTO(Pet pet) {
        if (pet == null) return null;

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
}