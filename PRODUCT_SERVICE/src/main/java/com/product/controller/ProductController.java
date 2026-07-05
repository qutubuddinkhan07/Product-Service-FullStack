package com.product.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.product.dtos.AddProductDto;
import com.product.dtos.ApiResponse;
import com.product.dtos.ProductResponseDto;
import com.product.entity.Product;
import com.product.modelmapper.ModelMapper;
import com.product.service.ProductService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
//@CrossOrigin("*")
@RequestMapping("/api/v1.0/product")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class ProductController {
	private final ProductService productService;
	private final ModelMapper modelMapper;

	@Value("${spring.application.name}")
	private String serviceName;

	@PostMapping
	public ResponseEntity<ApiResponse> addNewProductController(@Valid @RequestBody AddProductDto dto) {
		String serviceResponse = productService.addNewProductService(dto);
		ApiResponse apiResponse = ApiResponse.builder().serviceName("PRODUCT_SERVICE").status(true).type("string")
				.payload(serviceResponse).build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse> getProductByIdController(@PathVariable("id") Long id) {
		Product product = productService.getProductByIdService(id);
		ProductResponseDto dto = modelMapper.entityToResponseDtoMapper(product);
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("object")
				.payload(dto).build();

		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> deleteProductByIdController(@PathVariable("id") Long id) {
		Product product = productService.deleteProductByIdService(id);
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("string")
				.payload("Product deleted").build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse> updateProductById(@PathVariable("id") Long id, @RequestBody AddProductDto dto) {
		Product product = productService.updateProductByIdService(id, dto);
		ProductResponseDto response = modelMapper.entityToResponseDtoMapper(product);
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("object")
				.payload(response).build();

		return ResponseEntity.ok(apiResponse);
	}

	@GetMapping("/category")
	public ResponseEntity<ApiResponse> getProductByCategories(
			@RequestParam(name = "category", required = false, defaultValue = "FMCG") String category,
			@RequestParam(name = "sorting", required = false, defaultValue = "ASC") String sorting) {
		List<Product> products = productService.getProductByCategory(category, sorting);
		List<ProductResponseDto> dtos = products.stream().map(p -> modelMapper.entityToResponseDtoMapper(p)).toList();
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("object array")
				.payload(dtos).build();
		return ResponseEntity.ok(apiResponse);
	}

	@GetMapping("/page")
	public ResponseEntity<ApiResponse> getProductByPage(
			@RequestParam(name = "pageNo", required = false, defaultValue = "0") Integer pageNo,
			@RequestParam(name = "pageSize", required = false, defaultValue = "12") Integer pageSize,
			@RequestParam(name = "sorting", required = false, defaultValue = "NONE") String sorting) {
		List<Product> products = productService.getProductByPageService(pageNo, pageSize, sorting);
		List<ProductResponseDto> dtos = products.stream().map(p -> modelMapper.entityToResponseDtoMapper(p)).toList();
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("object array")
				.payload(dtos).build();
		return ResponseEntity.ok(apiResponse);
	}

	@GetMapping("/range")
	public ResponseEntity<ApiResponse> getProductInRangeByPageController(
			@RequestParam(name = "start", required = false, defaultValue = "0") BigDecimal start,
			@RequestParam(name = "end", required = false, defaultValue = "1000") BigDecimal end,
			@RequestParam(name = "pageNo", required = false, defaultValue = "0") Integer pageNo,
			@RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize) {
		List<Product> products = productService.getProductInRangeByPageService(start, end, pageNo, pageSize);
		List<ProductResponseDto> dtos = products.stream().map(p -> modelMapper.entityToResponseDtoMapper(p)).toList();
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("object array")
				.payload(dtos).build();

		return ResponseEntity.ok(apiResponse);
	}

	@PatchMapping("/stock/inc/{id}/{amount}")
	public ResponseEntity<ApiResponse> incStockController(@PathVariable("id") Long id,
			@PathVariable("amount") Integer stockAmount) {
		String serviceResponse = productService.incProductStock(id, stockAmount);
		ApiResponse apiResponse = ApiResponse.builder().serviceName(serviceName).status(true).type("string")
				.payload(serviceResponse).build();
		return ResponseEntity.ok(apiResponse);
	}

	@PatchMapping("/stock/dec/{id}/{amount}")
	public ResponseEntity<ApiResponse> decStockController(@PathVariable("id") Long id,
			@PathVariable("amount") Integer stockAmount) {
		String serviceResponse = productService.decProductStock(id, stockAmount);
		ApiResponse apiResponse = new ApiResponse(serviceName, true, "string", serviceResponse);
		return ResponseEntity.ok(apiResponse);
	}
}
