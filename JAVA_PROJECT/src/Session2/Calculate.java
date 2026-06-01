package Session2;

import java.util.Scanner;

public class Calculate {

    public static int Add(int a, int b) {
        return a + b;
    }

    public static int Subtract(int a, int b) {
        return a - b;
    }

    public static double Divide(int a, int b) {
        return (double) a / b;
    }

    public static int Multiply(int a, int b) {
        return a * b;
    }

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Nhap a: ");
        int a = scanner.nextInt();

        System.out.print("Nhap b: ");
        int b = scanner.nextInt();

        System.out.println("1. Cong");
        System.out.println("2. Tru");
        System.out.println("3. Nhan");
        System.out.println("4. Chia");

        System.out.print("Chon phep tinh: ");
        
        int choice = scanner.nextInt();

        switch (choice) {
            case 1:
                System.out.println("Ket qua = " + Add(a, b));
                break;

            case 2:
                System.out.println("Ket qua = " + Subtract(a, b));
                break;

            case 3:
                System.out.println("Ket qua = " + Multiply(a, b));
                break;

            case 4:
                if (b == 0) {
                    System.out.println("Khong the chia cho 0");
                } else {
                    System.out.println("Ket qua = " + Divide(a, b));
                }
                break;

            default:
                System.out.println("Lua chon khong hop le");
        }

        scanner.close();
    }
}