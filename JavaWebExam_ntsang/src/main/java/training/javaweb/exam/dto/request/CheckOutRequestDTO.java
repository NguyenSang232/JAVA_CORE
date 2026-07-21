package training.javaweb.exam.dto.request;

import java.time.LocalDate;

public class CheckOutRequestDTO {

	private LocalDate actualCheckOut;

	private Long pricePerDay;

	public LocalDate getActualCheckOut() {
		return actualCheckOut;
	}

	public void setActualCheckOut(LocalDate actualCheckOut) {
		this.actualCheckOut = actualCheckOut;
	}

	public Long getPricePerDay() {
		return pricePerDay;
	}

	public void setPricePerDay(Long pricePerDay) {
		this.pricePerDay = pricePerDay;
	}

}