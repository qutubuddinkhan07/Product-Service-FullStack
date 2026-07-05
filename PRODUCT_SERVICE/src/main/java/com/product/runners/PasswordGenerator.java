package com.product.runners;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class PasswordGenerator {
	private final PasswordEncoder passwordEncoder;

	public String generatePass(String password) {
		String pass = passwordEncoder.encode(password);
		return pass;
	}
}
