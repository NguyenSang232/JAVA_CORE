package OOP;

public class Developer extends NhanVien implements IDangNhap {
	
	public Developer(String Nv_name,String Nv_ms) {
		super(Nv_name,Nv_ms);
	}
	
	@Override
    public void lamviec() {
        System.out.println("Developer " + Nv_name + " (Mã: " + Nv_ms + ") đang viết code Java.");
    }

    @Override
    public void DangNhapHeThong() {
        System.out.println("Developer " + Nv_name + ": Đăng nhập bằng vân tay thành công.");
    }
}
