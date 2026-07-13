package training.javaweb.exam.config;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import training.javaweb.exam.entity.User;

public class CustomUserDetails implements UserDetails {

	private final User user;

	public CustomUserDetails(User user) {
		this.user = user;
	}

	public User getUser() {
		return user;
	}

	public Long getUserId() {
		return user.getId();
	}

	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return List.of(new SimpleGrantedAuthority(user.getRole()));

	}

	@Override
	public String getPassword() {

		return user.getPassword();

	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {

		return user.getEnabled();

	}
}
