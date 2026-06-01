package QuanLyNhanVien;

import java.util.Scanner;

public class Fibonacci {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter n: ");

        if (!scanner.hasNextInt()) {
            System.out.println("Invalid input!");
            return;
        }

        int n = scanner.nextInt();

        if (n <= 0) {
            System.out.println("n must be greater than 0");
            return;
        }

        int[] fibonacci = new int[n];

        if (n >= 1) {
            fibonacci[0] = 0;
        }

        if (n >= 2) {
            fibonacci[1] = 1;
        }

        for (int i = 2; i < n; i++) {
            fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
        }

        System.out.println("Fibonacci Sequence:");

        for (int num : fibonacci) {
            System.out.print(num + " ");
        }
    }
}
