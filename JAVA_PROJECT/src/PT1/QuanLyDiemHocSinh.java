package OOP;

import java.util.Scanner;

public class QuanLyDiemHocSinh {
    private double[] diemhocvien;
    private int n;
    public void input() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("--- Day la chuong trinh quan ly diem ---");
        System.out.print("Vui long nhap so luong hoc sinh muon xu ly: ");
        n = scanner.nextInt();
        diemhocvien = new double[n];
        for (int i = 0; i < n; i++) {
            while (true) {
                System.out.print("Nhap diem cho hoc sinh thu " + (i + 1) + ": ");
                double diem = scanner.nextDouble();         
                if (diem >= 0 && diem <= 10) {
                    diemhocvien[i] = diem;
                    break;
                } else {
                    System.out.println("❌ Diem khong hop le vui long nhap lai!");
                }
            }
        }
    }
    public void tinhdiem() {
        if (diemhocvien == null || diemhocvien.length == 0) {
            System.out.println("Chưa có dữ liệu học sinh để tính điểm!");
            return;
        }
        double DiemLonNhat = diemhocvien[0];
        double TongDiem = 0;
        for (int i = 0; i < diemhocvien.length; i++) {
            if (diemhocvien[i] > DiemLonNhat) {
                DiemLonNhat = diemhocvien[i];
            }
            TongDiem += diemhocvien[i];
        }
        double Trungbinh = TongDiem / diemhocvien.length;
        System.out.println("KET QUA");
        System.out.printf("Diem trung binh cua lop la: %.2f\n", Trungbinh);
        System.out.println("Diem lon nhat cua lop la: " + DiemLonNhat);
    }
    public class Main {
        public static void main(String[] args) {
            QuanLyDiemHocSinh ql = new QuanLyDiemHocSinh();
            ql.input();
            ql.tinhdiem();
        }
    }
}