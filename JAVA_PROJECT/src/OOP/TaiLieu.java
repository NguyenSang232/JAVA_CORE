package OOP;

public abstract class TaiLieu {
    private String maTaiLieu;
    private String nhaXuatBan;
    private int soBanPhatHanh;
    public TaiLieu(String maTaiLieu, String nhaXuatBan, int soBanPhatHanh) {
        this.maTaiLieu = maTaiLieu;
        this.nhaXuatBan = nhaXuatBan;
        this.soBanPhatHanh = soBanPhatHanh;
    }
    public String getMaTaiLieu() { return maTaiLieu; }
    public int getSoBanPhatHanh() { return soBanPhatHanh; }
    public abstract void hienThiThongTin();
}
