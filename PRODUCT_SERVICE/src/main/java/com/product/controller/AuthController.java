package com.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.product.dtos.ApiResponse;
import com.product.dtos.LoginRequest;
import com.product.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
//@CrossOrigin("*")
@RequestMapping("/api/v3/auth")
public class AuthController {
	@Autowired
	private AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse> authenticateUserNamePasswordController(@RequestBody LoginRequest request) {

		String jwt = authService.authUserNamePasswordService(request.getUsername(), request.getPassword());

		ApiResponse apiResponse = ApiResponse.builder().serviceName("PRODUCT_SERVICE").status(true).type("string")
				.payload(jwt).build();

		return ResponseEntity.ok(apiResponse);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse> logOutController(HttpServletRequest request) {
		String serviceResponse = authService.logOutService(request);
		ApiResponse apiResponse = ApiResponse.builder().serviceName("AUTH_SERVICE").status(true).type("string")
				.payload(serviceResponse).build();
		return ResponseEntity.ok(apiResponse);
	}
}
