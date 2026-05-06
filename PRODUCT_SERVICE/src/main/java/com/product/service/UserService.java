package com.product.service;

import com.product.dtos.AddUserDto;
import com.product.dtos.EmailOtpVerifyDto;

public interface UserService {
	public String initiateUserVerificationService(AddUserDto dto);

	public String finalUserVerificationService(EmailOtpVerifyDto dto);
}
