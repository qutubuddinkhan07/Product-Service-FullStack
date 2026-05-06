package com.product.service;

import java.math.BigDecimal;
import java.util.List;

import com.product.dtos.AddProductDto;
import com.product.entity.Product;

public interface ProductService {
	public String addNewProductService(AddProductDto dto);

	public Product getProductByIdService(Long id);

	public Product deleteProductByIdService(Long id);

	public Product updateProductByIdService(Long id, AddProductDto dto);

	public List<Product> getProductByCategory(String category, String sorting);

	public List<Product> getProductByPageService(Integer pageNo, Integer pageSize, String sorting);

	public List<Product> getProductByPageService(Integer pageNo, Integer pageSize);

	public List<Product> getProductInRangeByPageService(BigDecimal start, BigDecimal end, Integer pageNo,
			Integer pageSize);

	public String incProductStock(Long id, Integer stockAmount);

	public String decProductStock(Long id, Integer stockAmount);
}
