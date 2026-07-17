package training.javaweb.exam.dto.request;

import java.time.LocalDate;

public class CheckOutRequestDTO {

	private LocalDate actualCheckOut;

	private Long baseFee;

	public Long getBaseFee() {
		return baseFee;
	}

	public void setBaseFee(Long baseFee) {
		this.baseFee = baseFee;
	}

	public LocalDate getActualCheckOut() {
		return actualCheckOut;
	}

	public void setActualCheckOut(LocalDate actualCheckOut) {
		this.actualCheckOut = actualCheckOut;
	}
}