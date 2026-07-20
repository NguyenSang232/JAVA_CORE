package training.javaweb.exam.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private final RequestCache requestCache = new HttpSessionRequestCache();

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		if (savedRequest != null) {
			super.onAuthenticationSuccess(request, response, authentication);
			return;
		}
		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
		if (isAdmin) {
			response.sendRedirect("/admin.html");
		} else {
			response.sendRedirect("/user.html");
		}
	}
}