package Session2;

import java.util.Scanner;

public enum Enums {
//	SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY;
//	public void printInfo() {
//		if(this == SATURDAY || this == SUNDAY) {
//			System.out.println("Weekend!");
//		} else {
//			System.out.println("Daywork!");
//		}
//	}
//    public static void main(String[] args) {
//    	Scanner scanner = new Scanner(System.in);
//    	System.out.println("Enter the day: \n");
//    	String input = scanner.nextLine().toUpperCase();
//    	Enums day = valueOf(input);
//    	day.printInfo();
//    	scanner.close();
////        Enums day = Enums.SATURDAY;
////        day.printInfo();
//    }
    MERCURY(3.303, 2.43),
    VENUS(4.86, 6.05),
    EARTH(5.976, 6.37);
	private final double mass;
	private final double radius;
	Enums(double mass, double radius){
		this.mass = mass;
		this.radius = radius;
	}
	public double mass() {
		return mass;
	}
	public double radius() {
		return radius;
	}
	
	public static void main(String[] args) {
//		for(Enums planet: Enums.values()) {
//			System.out.println("Planet: "+planet);
//			System.out.println("Mass: "+ planet.mass());
//			System.out.println("Radius: "+planet.radius());
//			System.out.println("---------------------------");
//		}
		Enums planet = Enums.EARTH;
		System.out.println("Planet: "+planet);
		System.out.println("Mass: "+ planet.mass());
		System.out.println("Radius: "+planet.radius());
		System.out.println("---------------------------");

	}
}

