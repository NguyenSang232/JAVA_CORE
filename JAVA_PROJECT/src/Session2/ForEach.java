package Session2;

import java.util.Scanner;

public class ForEach {

	public static void main(String[] args) {
//		int[] numbers = {1,2,3,4,5};
//		
//		for(int number : numbers) {
//			System.out.println(number);
//		}
//While		
//		int i = 0;
//		while(i <= 5) {
//			System.out.println("The value of i: "+i);
//			i++;
//		}
		
// Do - while
//		int i=0;
//		do {
//			System.out.println("The value of i: "+ i);
//			i++;
//		} while (i<=5);
		
// Break statement
//		for(int i=0;i<10;i++) {
//			if(i == 5) {
//				System.out.println("The value of i: "+ i);
//				break;
//			}
//			if(i%2 == 0) {
//				System.out.println("This is a even number: "+i);
//			} else {
//				System.out.println("This is a oll number: "+i);
//			}
//			
//		}
//		
//	int i =20;
//	String result = ( i % 2 == 0) ? "Even" : "Odd";
//	System.out.println(result);
		
//	int n;
//	Scanner scanner = new Scanner(System.in);
//	n = scanner.nextInt();
//	switch (n) {
//	case 1: {
//		System.out.println("This is a even number");
//		break;
//	}
//	case 2:{
//		System.out.println("This is a oll number");
//		break;
//	}
//	default:
//		throw new IllegalArgumentException("Unexpected value: " + n);
//	}
	
		int choice;
		Scanner scanner = new Scanner(System.in);
		while(true) {
			System.out.println("\n=====Menu=====");
			System.out.println("Enter 1 to continue!");
			System.out.println("Enter 2 show the current number!");
			System.out.println("Enter 3 to break\n");
			choice = scanner.nextInt();
			switch(choice) {
			case 1:
				System.out.println("Hello Kai");
				break;
			case 2:
				System.out.println("This is a this number: "+ choice);
				break; // van con tiep tuc duoc
			case 3: 
				System.out.println("Exit!");
				return; // ket thuc chuong trinh
			default:
				System.out.println("Invalid choice!");
			}
		}
	}
	
}
