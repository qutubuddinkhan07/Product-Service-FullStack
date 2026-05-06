package com.product.serviceimpl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.product.service.AuthService;
import com.product.util.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	@Qualifier("invalidjwt")
	private Set<String> blockedJwt;

	@Override
	public String authUserNamePasswordService(String username, String password) {
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
		Authentication authentication = authManager.authenticate(token);
		if (authentication.isAuthenticated()) {
			List<String> roles = authentication.getAuthorities().stream().map(authority -> authority.getAuthority())
					.toList();
			String jwt = jwtUtil.createJwtToken(username, roles);
			return jwt;
		}
		throw new RuntimeException("Invalid password");
	}

	@Override
	public String logOutService(HttpServletRequest request) {
		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		String jwt = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			jwt = authHeader.substring(7);
		}
		if (blockedJwt.contains(jwt)) {
			return "already log out";
		}
		blockedJwt.add(jwt);
		return "Log out successful";
	}

}
