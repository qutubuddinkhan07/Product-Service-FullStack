package com.product.exception;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.product.dtos.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse> handleDtoValidationException(MethodArgumentNotValidException ex) {
//		String message = ex.getBindingResult().getFieldErrors().stream().map(error -> error.getDefaultMessage())
//				.findFirst().orElse("Validation Error");
		List<String> message = ex.getBindingResult().getAllErrors().stream().map(error -> error.getDefaultMessage())
				.toList();

		ApiResponse apiResponse = ApiResponse.builder().serviceName("PRODUCT_SERVICE").status(false).type("array")
				.payload(message).build();

		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<ApiResponse> noSuchElementExceptionHandler(NoSuchElementException ex) {
		ApiResponse apiResponse = ApiResponse.builder().serviceName(null).status(false).type("string")
				.payload(ex.getMessage()).build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	// general exception handler
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> generalExceptionHandler(Exception ex) {

		ApiResponse apiResponse = ApiResponse.builder().serviceName("PRODUCT_SERVICE").status(false).type("string")
				.payload(ex.getMessage()).build();

		return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
