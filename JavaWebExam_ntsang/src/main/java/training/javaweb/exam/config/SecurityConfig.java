package training.javaweb.exam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final CustomUserDetailsService customUserDetailsService;
	private final CustomAuthenticationSuccessHandler successHandler;

	public SecurityConfig(CustomUserDetailsService customUserDetailsService,
			CustomAuthenticationSuccessHandler successHandler) {
		this.customUserDetailsService = customUserDetailsService;
		this.successHandler = successHandler;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).userDetailsService(customUserDetailsService)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/login", "/.well-known/**", "/login.html", "/auth/**", "/static/**",
								"/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/style/**", "/js/**")
						.permitAll().requestMatchers("/admin.html").hasRole("ADMIN").requestMatchers("/user.html")
						.hasAnyRole("CUSTOMER", "ADMIN").requestMatchers("/api/owners/**").hasRole("ADMIN")
						.requestMatchers("/api/boarding-records/checkout/**", "/api/boarding-records/admin/**")
						.hasRole("ADMIN")
						.requestMatchers("/api/pets/my-pets", "/api/boarding-records/my-boarding",
								"/api/boarding-records/my-history")
						.hasRole("CUSTOMER").anyRequest().authenticated())
				.formLogin(form -> form.loginPage("/login.html").loginProcessingUrl("/login")
						.successHandler(successHandler).permitAll())
				.logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login.html?logout").permitAll());
		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

}
//.rememberMe(remember -> remember.key("pet-boarding-key").tokenValiditySeconds(86400 * 7))