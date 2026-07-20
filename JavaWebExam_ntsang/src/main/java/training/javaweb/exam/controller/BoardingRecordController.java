package training.javaweb.exam.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import training.javaweb.exam.config.CustomUserDetails; // Thay đổi tùy theo package chứa CustomUserDetails của bạn
import training.javaweb.exam.dto.request.BoardingRecordRequestDTO;
import training.javaweb.exam.dto.request.CheckOutRequestDTO;
import training.javaweb.exam.dto.response.BoardingRecordResponseDTO;
import training.javaweb.exam.service.BoardingRecordService;

@RestController
@RequestMapping("/api/boarding-records")
@CrossOrigin("*")
@Tag(name = "Boarding Record Management", description = "API quản lý phiếu gửi")
public class BoardingRecordController {

    @Autowired
    private BoardingRecordService boardingRecordService;

    // C1. Tạo phiếu gửi mới [role ADMIN]
    @PostMapping
    @Operation(summary = "C1 Create boarding record", description = "Tạo mới phiếu gửi")
    public ResponseEntity<BoardingRecordResponseDTO> create(@Valid @RequestBody BoardingRecordRequestDTO dto) {
        return ResponseEntity.ok(boardingRecordService.create(dto));
    }

    // C2. Hiển thị tất cả phiếu gửi [role ADMIN]
    @GetMapping
    @Operation(summary = "C2 Get all boarding record", description = "Lấy danh sách tất cả phiếu gửi")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(boardingRecordService.getAll());
    }

    // C3. Xem chi tiết (kèm Pet, Owner, CareNotes) [role ADMIN]
    @GetMapping("/{id}")
    @Operation(summary = "C3 Get detail boarding record", description = "Lấy chi tiết phiếu gửi kèm Pet, Owner, CareNotes")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(boardingRecordService.getDetail(id));
    }

    // C4. Trả thú cưng (check-out) [role ADMIN]
    @PutMapping("/checkout/{id}")
    @Operation(summary = "C4 Checkout boarding record", description = "Checkout để nhận thú cưng và tính phí")
    public ResponseEntity<BoardingRecordResponseDTO> checkOut(@PathVariable Long id,
            @RequestBody CheckOutRequestDTO request) {
        boardingRecordService.checkOut(id, request.getActualCheckOut(), request.getBaseFee());
        BoardingRecordResponseDTO response = boardingRecordService.getDetail(id);
        return ResponseEntity.ok(response);
    }

    // C5. Danh sách đang gửi (BOARDING) [role ADMIN]
    @GetMapping("/current")
    @Operation(summary = "C5 Get all current boarding", description = "Lấy danh sách tất cả phiếu gửi đang gửi")
    public ResponseEntity<?> currentBoarding() {
        return ResponseEntity.ok(boardingRecordService.getCurrentBoarding());
    }

    // C6. Lịch sử gửi theo thú cưng [role ADMIN]
    @GetMapping("/pet/{petId}")
    @Operation(summary = "C6 Get all boarding record by Pets", description = "Lấy danh sách lịch sử phiếu gửi theo thú cưng")
    public ResponseEntity<?> historyByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(boardingRecordService.getHistoryByPet(petId));
    }

    // C7. Lịch sử gửi theo chủ nuôi [role ADMIN]
    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "C7 Get all boarding record by Owners", description = "Lấy danh sách lịch sử phiếu gửi theo chủ nuôi")
    public ResponseEntity<?> historyByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(boardingRecordService.getHistoryByOwner(ownerId));
    }

    // C8. Tìm kiếm theo khoảng thời gian [role ADMIN]
    @GetMapping("/date")
    @Operation(summary = "C8 Get all boarding record by Date", description = "Lấy danh sách tất cả phiếu gửi theo khung thời gian")
    public ResponseEntity<?> findByDate(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(boardingRecordService.findByDate(from, to));
    }

    // C9. Phiếu đang gửi của tôi [role CUSTOMER]
    @GetMapping("/my-current")
    @Operation(summary = "C9 Get my current boarding", description = "Lấy danh sách phiếu đang gửi của tôi dựa vào tài khoản đăng nhập")
    public ResponseEntity<?> myCurrent(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(boardingRecordService.getMyCurrentBoarding(userId));
    }

    // C10. Lịch sử gửi của tôi, mới nhất trước [role CUSTOMER]
    @GetMapping("/my-history")
    @Operation(summary = "C10 Get my history boarding", description = "Lấy danh sách lịch sử phiếu gửi của tôi dựa vào tài khoản đăng nhập")
    public ResponseEntity<?> myHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(boardingRecordService.getMyHistory(userId));
    }
}