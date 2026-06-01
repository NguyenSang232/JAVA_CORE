package OOP;

public abstract class NhanVien {
	protected String Nv_name;
	protected String Nv_ms;
	public abstract void lamviec();
	public NhanVien(String Nv_name, String Nv_ms) {
        this.Nv_name =Nv_name;
        this.Nv_ms= Nv_ms;
    }
}
