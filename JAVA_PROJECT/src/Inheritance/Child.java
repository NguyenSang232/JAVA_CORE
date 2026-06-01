package Inheritance;

public class Child extends Parent {
	public void Sound() {
		System.out.println("This is primary school!");
	}
	public static void main(String[] args) {
		Child child = new Child();
		child.notice();
		child.Sound();
	}
}
