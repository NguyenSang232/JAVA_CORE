package OOP;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QuanlyThuVien {
    private List<TaiLieu> danhSachTaiLieu = new ArrayList<>();
    
    private Map<String, TaiLieu> banDoTaiLieu = new HashMap<>();

    public void themTaiLieu(TaiLieu tl) {
        if (banDoTaiLieu.containsKey(tl.getMaTaiLieu())) {
            System.out.println("Lỗi: Mã tài liệu " + tl.getMaTaiLieu() + " đã tồn tại!");
            return;
        }
        danhSachTaiLieu.add(tl);
        banDoTaiLieu.put(tl.getMaTaiLieu(), tl);
        System.out.println("Thêm thành công tài liệu: " + tl.getMaTaiLieu());
    }

    public void hienThiDanhSach() {
        System.out.println("\nDANH SÁCH TÀI LIỆU TRONG THƯ VIỆN");
        for (TaiLieu tl : danhSachTaiLieu) {
            tl.hienThiThongTin(); 
        }
    }

    public void timKiemBaoMat(String maCanTim) {
        System.out.println("\nKẾT QUẢ TÌM KIẾM MÃ [" + maCanTim + "]");
        TaiLieu tl = banDoTaiLieu.get(maCanTim); 
        if (tl != null) {
            tl.hienThiThongTin();
        } else {
            System.out.println("❌ Không tìm thấy tài liệu nào có mã: " + maCanTim);
        }
    }

    public int tinhTongSoBanPhatHanh() {
        int tong = 0;
        for (TaiLieu tl : danhSachTaiLieu) {
            tong += tl.getSoBanPhatHanh();
        }
        return tong;
    }
    public class Main {
        public static void main(String[] args) {
            QuanlyThuVien thuVien = new QuanlyThuVien();

            TaiLieu sach1 = new Sach("S001", "Kim Đồng", 500, "Nguyễn Nhật Ánh", 250);
            TaiLieu sach2 = new Sach("S002", "Tuổi Trẻ", 300, "Nam Cao", 120);
            TaiLieu sachTrung = new Sach("S001", "Giáo Dục", 100, "Người Khác", 90);    
            thuVien.themTaiLieu(sach1);
            thuVien.themTaiLieu(sach2);
            thuVien.themTaiLieu(sachTrung);

            thuVien.hienThiDanhSach();

            thuVien.timKiemBaoMat("S002");

            System.out.println("\nTổng số bản phát hành trong kho: " + thuVien.tinhTongSoBanPhatHanh());
        }
    }
}