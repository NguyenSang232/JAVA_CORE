package Session2;

import java.util.Scanner;

public class FindLargeNumber {
	public static void TimSoLonNhat(int array[], int n) {
		int max = array[0];
		for(int i =1;i < n;i++) {
			if(array[i] > max) {
				max = array[i];
			}
		}
		System.out.println("The max value of this Array is: "+max);
	}
	public static void input(int array[], int n) {
		Scanner scanner = new Scanner(System.in);
		for(int i=0;i<n;i++) {
			System.out.println("Vui long nhap gia tri thu "+(i+1));
			array[i] = scanner.nextInt();
		}
	}
	public static void main(String[] args) {
		int n;
		Scanner scanner = new Scanner(System.in);
		System.out.println("Nhap so phan tu cua mang: ");
		n = scanner.nextInt();
		int[] array = new int[n];
		input(array,n);
		TimSoLonNhat(array, n);
	}
}
