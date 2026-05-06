package com.product.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
	private String serviceName = "PRODUCT_SERVICE";
	private boolean status;
	private String type;
	private Object payload;
}
