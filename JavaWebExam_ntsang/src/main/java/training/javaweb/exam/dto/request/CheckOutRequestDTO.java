package training.javaweb.exam.dto.request;

import java.time.LocalDate;

public class CheckOutRequestDTO {

	private LocalDate actualCheckOut;

	public LocalDate getActualCheckOut() {
		return actualCheckOut;
	}

	public void setActualCheckOut(LocalDate actualCheckOut) {
		this.actualCheckOut = actualCheckOut;
	}
}