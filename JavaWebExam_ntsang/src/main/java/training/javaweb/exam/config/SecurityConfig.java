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
						.requestMatchers("/login", "/login.html", "/auth/**", "/api/owners/**", "/api/users/**","/api/users/owner/**",
								"/api/care-notes/**", "/api/boarding-records/**", "/api/pets/**", "/static/**",
								"/api/boarding-records/checkout/**", "/api/pets/owner/**", "/admin.html",
								"/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/style/**", "/js/**")
						.permitAll().requestMatchers("/admin/**").hasRole("ADMIN").requestMatchers("/users/**")
						.hasAnyRole("USER", "ADMIN").anyRequest().authenticated())
				.formLogin(form -> form.loginPage("/login.html").loginProcessingUrl("/login")
						.successHandler(successHandler).permitAll())

				.logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login.html?logout")
						.invalidateHttpSession(true).clearAuthentication(true).deleteCookies("JSESSIONID").permitAll());
		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

}
//.rememberMe(remember -> remember.key("pet-boarding-key").tokenValiditySeconds(86400 * 7))