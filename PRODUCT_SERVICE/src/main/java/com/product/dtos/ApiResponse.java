package com.product.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
	@Default
	private String serviceName = "PRODUCT_SERVICE";
	private boolean status;
	private String type;
	private Object payload;
}
