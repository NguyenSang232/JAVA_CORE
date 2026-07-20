package training.javaweb.exam.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import training.javaweb.exam.dto.response.PriceResponseDTO;
import training.javaweb.exam.entity.Price;
import training.javaweb.exam.service.PriceService;

@RestController
@RequestMapping("/api/prices")
@PreAuthorize("hasRole('ADMIN')") // Chặn toàn bộ Controller, chỉ ADMIN mới được truy cập
public class PriceController {

    private final PriceService priceService;

    // Dùng Constructor Injection bảo đảm tính hiện đại và dễ test
    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    /**
     * 1. Lấy toàn bộ danh sách cấu hình giá
     * GET: /api/prices
     */
    @GetMapping
    public ResponseEntity<List<PriceResponseDTO>> getAllPrices() {
        List<PriceResponseDTO> prices = priceService.getAllPrices();
        return ResponseEntity.ok(prices);
    }

    /**
     * 2. Lấy chi tiết một cấu hình giá theo ID
     * GET: /api/prices/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PriceResponseDTO> getPriceById(@PathVariable Long id) {
        PriceResponseDTO price = priceService.getPriceById(id);
        return ResponseEntity.ok(price);
    }

    /**
     * 3. Thêm mới một cấu hình giá
     * POST: /api/prices
     */
    @PostMapping
    public ResponseEntity<PriceResponseDTO> createPrice(@RequestBody Price priceEntity) {
        PriceResponseDTO createdPrice = priceService.createPrice(priceEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPrice);
    }

    /**
     * 4. Cập nhật cấu hình giá theo ID
     * PUT: /api/prices/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PriceResponseDTO> updatePrice(@PathVariable Long id, @RequestBody Price priceDetails) {
        PriceResponseDTO updatedPrice = priceService.updatePrice(id, priceDetails);
        return ResponseEntity.ok(updatedPrice);
    }

    /**
     * 5. Xóa cấu hình giá theo ID
     * DELETE: /api/prices/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrice(@PathVariable Long id) {
        priceService.deletePrice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PriceResponseDTO> getPriceByTypeAndWeight(
            @RequestParam("typeOfAnimal") String typeOfAnimal, 
            @RequestParam("weight") BigDecimal weight) {
        PriceResponseDTO price = priceService.getPriceByTypeAndWeight(typeOfAnimal, weight);
        return ResponseEntity.ok(price);
    }
}