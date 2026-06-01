package Session2;

import java.util.Scanner;

public class TinhTongNso {
	public static int Tinhtong(int n) {
		int sum = 0;
		for(int i = 0; i<n;i++) {
			sum+=i;
		}
		return sum;
	}
	public static void main(String[] args) {
		int n;
		Scanner scanner = new Scanner(System.in);
		while(true){
			System.out.println("Vui long nhap so n: ");
			if(scanner.hasNextInt()){
				n = scanner.nextInt();
				break;
			}
			System.out.println("Vui long nhap lai so");
			scanner.next();
		}
		int sum = Tinhtong(n);
		System.out.println("Tong la: "+sum);
	}
}
