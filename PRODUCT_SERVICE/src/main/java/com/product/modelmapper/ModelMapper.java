package com.product.modelmapper;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.product.dtos.AddProductDto;
import com.product.dtos.AddUserDto;
import com.product.dtos.ProductResponseDto;
import com.product.entity.Product;
import com.product.entity.User;

@Component
public class ModelMapper {
	@Autowired
	private PasswordEncoder passwordEncoder;

	public Product getProductFromAddProductDtoMapper(AddProductDto dto) {
		Product product = Product.builder().name(dto.getName()).description(dto.getDescription()).brand(dto.getBrand())
				.category(dto.getCategory()).stock(dto.getStock()).price(dto.getPrice()).isActive(true)
				.createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
		return product;
	}

	public ProductResponseDto entityToResponseDtoMapper(Product product) {
		return ProductResponseDto.builder().name(product.getName()).description(product.getDescription())
				.brand(product.getBrand()).category(product.getCategory()).price(product.getPrice()).build();
	}

	public User addUserDtoToUserEntity(AddUserDto dto) {
		User user = User.builder().name(dto.getName()).email(dto.getEmail())
				.password(passwordEncoder.encode(dto.getPassword())).role(dto.getRole()).createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now()).build();
		return user;
	}
}
