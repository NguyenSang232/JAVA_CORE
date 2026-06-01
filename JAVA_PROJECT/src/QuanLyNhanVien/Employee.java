package QuanLyNhanVien;

public class Employee extends Person {

    private double baseSalary;
    private EmployeeLevel level;
    public Employee(String id,
                    String name,
                    int age,
                    double baseSalary,
                    EmployeeLevel level) {

        super(id, name, age);

        this.baseSalary = baseSalary;
        this.level = level;
    }

    public double getBaseSalary() {
        return baseSalary;
    }

    public EmployeeLevel getLevel() {
        return level;
    }

    public double calculateSalary() {
        return baseSalary * level.getMultiplier();
    }

    public void printInfo() {

        System.out.println("ID: " + getId());
        System.out.println("Name: " + getName());
        System.out.println("Age: " + getAge());
        System.out.println("Level: " + level);
        System.out.println("Base Salary: " + baseSalary);
        System.out.println("Monthly Salary: " + calculateSalary());
        System.out.println("------------------------");
    }
}