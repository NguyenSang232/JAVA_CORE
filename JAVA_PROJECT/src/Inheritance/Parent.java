package Inheritance;

public class Parent {
	private String name;
	private String address;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Parent(String name, String address) {
		this.name = name;
		this.address = address;
	}
	
	public Parent() {
		this.name = name;
		this.address = address;
	}
	public void notice() {
		System.out.println("This is my home!\n");
	}
}
