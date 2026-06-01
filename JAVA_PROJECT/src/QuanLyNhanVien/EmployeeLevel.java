package QuanLyNhanVien;

public enum EmployeeLevel {
	INTERN(1.0), 
	JUNIOR(1.5),
	MIDDLE(2.0),
	SENIOR(3.0),
	LEAD(4.0);
	private final double hesoluong;
	EmployeeLevel(double hesoluong){
		this.hesoluong = hesoluong;
	}
	public double getHesoluong() {
		return hesoluong;
	}
	public double getMultiplier() {
        return hesoluong;
    }
}
