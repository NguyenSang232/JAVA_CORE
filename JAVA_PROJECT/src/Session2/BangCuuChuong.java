package Session2;

import java.util.Scanner;

public class BangCuuChuong {
	public static void BangCuuChuong(int n) {
		for(int i = 1;i <= 10;i++) {
			System.out.println(n + " * " + i +" = " +n*i);
		}
	}
	public static void main(String[] args) {
		int n;
		Scanner scanner = new Scanner(System.in);
		while(true) {
			System.out.println("Vui long nhap so: ");
			if(scanner.hasNextInt()) {
				n = scanner.nextInt();
				if (n > 0) {
                    break;
                } else {
                    System.out.println("So phai lon hon 0!");
                }
            } else {
                System.out.println("Vui long nhap so nguyen!");
                scanner.next();
            }
		}
		BangCuuChuong(n);
	}
}
