package Session2;

import java.util.Scanner;

public class TinhTongMang {
	public static int SumofArray(int array[], int n) {
		int sum = 0;
		for(int i =0;i<n;i++) {
			sum+=array[i];
		}
		return sum;
	}
	public static void input(int array[], int n) {
		Scanner scanner = new Scanner(System.in);
		for(int i=0;i<n;i++) {
			System.out.println("Vui long nhap gia tri thu "+(i+1));
			array[i] = scanner.nextInt();
		}
	}
	public static void main(String[] args) {
	    Scanner scanner = new Scanner(System.in);
	    System.out.print("Nhap so phan tu cua mang: ");
	    int n = scanner.nextInt();
	    int[] array = new int[n];
	    input(array, n);
	    int sum = SumofArray(array, n);
	    System.out.println("Tong mang = " + sum);
	}
}
