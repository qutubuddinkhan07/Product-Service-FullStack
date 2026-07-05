package com.product.filter;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.product.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTFilter extends OncePerRequestFilter {
	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	@Qualifier("invalidjwt")
	private Set<String> blockedJwt;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// Safety net for OPTIONS (ngrok sometimes bypasses shouldNotFilter)
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			filterChain.doFilter(request, response);
			return;
		}

		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//		System.out.println(authHeader);
		String jwt = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			jwt = authHeader.substring(7);
		}
		System.out.println(jwt);
		if (jwt == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"JWT not found\"}");
			return;
		}

		try {
			if (jwtUtil.isTokenExpired(jwt) || blockedJwt.contains(jwt)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json");
				response.getWriter().write("{\"message\": \"JWT expired\"}");
				return;
			}

			// extract username & roles from jwt
			String username = jwtUtil.extractUsername(jwt);
			List<String> roles = jwtUtil.extractRoles(jwt);

			// Convert to authorities
			List<SimpleGrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();

			// ✅ create Authentication object
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
					authorities);

			// 🔥 THIS LINE (very important)
			SecurityContextHolder.getContext().setAuthentication(auth);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"JWT invalid\"}");
			return;
		}

		// success
		filterChain.doFilter(request, response);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String url = request.getRequestURI();
		String method = request.getMethod();
		return "OPTIONS".equalsIgnoreCase(method) || url.startsWith("/api/v3/auth") || url.startsWith("/api/v2/user")
				|| url.startsWith("/swagger-ui") || url.equals("/swagger-ui.html");
	}

}
