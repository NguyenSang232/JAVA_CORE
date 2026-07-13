package training.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import training.javaweb.exam.dto.PetDTO;
import training.javaweb.exam.service.PetService;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin("*")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody PetDTO dto,
                                    BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getFieldErrors());
        }

        petService.createPet(dto);
        return ResponseEntity.ok("Pet created successfully.");
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(petService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody PetDTO dto,
                                    BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getFieldErrors());
        }

        petService.update(id, dto);
        return ResponseEntity.ok("Pet updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        petService.delete(id);
        return ResponseEntity.ok("Pet deleted successfully.");
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> findByType(@PathVariable String type) {
        return ResponseEntity.ok(petService.findByType(type));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> findByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(petService.findByOwnerId(ownerId));
    }

    @GetMapping("/my-pets/{userId}")
    public ResponseEntity<?> myPets(@PathVariable Long userId) {
        return ResponseEntity.ok(petService.findMyPets(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {

        petService.updateStatus(id, status);
        return ResponseEntity.ok("Pet status updated successfully.");
    }
}