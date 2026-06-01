package Session2;

import java.util.Scanner;

public class TinhTong {
	public static void main(String[] args) {
		int n;
		Scanner scanner = new Scanner(System.in);
		while(true) {
			System.out.println("Enter number: ");
			if(scanner.hasNextInt()) {
				n = scanner.nextInt();
				break;
			}
			System.out.println("Vui long nhap dung dinh dang so: ");
			scanner.next();
		}
		int sum = 0;
		while(n != 0) {
			int temp = n % 10;
			sum+=temp;
			n=n/10;
		}
		System.out.println("The sum of number is: "+sum);
	}
}
