package QuanLyNhanVien;

public class Main {

    public static void main(String[] args) {

        Employee emp1 = new Employee(
                "EMP01",
                "Kai",
                22,
                1000,
                EmployeeLevel.SENIOR
        );

        emp1.printInfo();
    }
}