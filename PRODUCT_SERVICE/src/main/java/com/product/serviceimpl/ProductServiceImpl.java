package com.product.serviceimpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.product.dtos.AddProductDto;
import com.product.entity.Product;
import com.product.modelmapper.ModelMapper;
import com.product.repository.ProductRepository;
import com.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	private final ProductRepository productRepo;
	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public String addNewProductService(AddProductDto dto) {
		Product product = modelMapper.getProductFromAddProductDtoMapper(dto);
		product = productRepo.save(product);
		String response = "product saved inside inventory with product id: " + product.getPid();
		return response;
	}

	@Override
	@Cacheable(value = "product", key = "#id")
	public Product getProductByIdService(Long id) {
		Optional<Product> optProduct = productRepo.findById(id);
		if (optProduct.isEmpty()) {
			throw new NoSuchElementException("No product found with id: " + id);
		}

		Product product = optProduct.get();
		if (!product.getIsActive()) {
			throw new NoSuchElementException("No product found with id: " + id);
		}

		return product;
	}

	@Override
	public Product deleteProductByIdService(Long id) {
		Product product = getProductByIdService(id);
		product.setIsActive(false);
		product = productRepo.save(product);
		return product;
	}

	@Override
	public Product updateProductByIdService(Long id, AddProductDto dto) {
		Product product = getProductByIdService(id);
		product.setName(dto.getName());
		product.setBrand(dto.getBrand());
		product.setDescription(dto.getDescription());
		product.setPrice(dto.getPrice());
		product.setCategory(dto.getCategory());
		product.setStock(dto.getStock());
		product.setUpdatedAt(LocalDateTime.now());
		product = productRepo.save(product);
		return product;
	}

	@Override
	public List<Product> getProductByCategory(String category, String sorting) {
		category = category.toUpperCase();
		sorting = sorting.toUpperCase();
		Comparator<Product> asc = (i, j) -> i.getPrice().compareTo(j.getPrice());
		Comparator<Product> dsc = (i, j) -> j.getPrice().compareTo(i.getPrice());
		Comparator<Product> comparator = (sorting.equals("ASC")) ? asc : dsc;

		List<Product> products = productRepo.getByCategory(category);
		products = products.stream().filter(i -> i.getIsActive()).sorted(comparator).toList();
		return products;
	}

	@Override
	public List<Product> getProductByPageService(Integer pageNo, Integer pageSize, String sorting) {
		if (sorting == null || sorting.equalsIgnoreCase("NONE")) {
			return getProductByPageService(pageNo, pageSize);
		}

		Sort sort = (sorting.equalsIgnoreCase("ASC")) ? Sort.by("price").ascending() : Sort.by("price").descending();
		Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
		Page<Product> page = productRepo.findAll(pageable);
		return page.getContent();
	}

	@Override
	public List<Product> getProductByPageService(Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<Product> page = productRepo.findAll(pageable);
		return page.getContent();
	}

	@Override
	public List<Product> getProductInRangeByPageService(BigDecimal start, BigDecimal end, Integer pageNo,
			Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("price").ascending());
		Page<Product> page = productRepo.getByRange(start, end, pageable);
		return page.getContent();
	}

	@Override
	@Transactional
	public String incProductStock(Long id, Integer stockAmount) {
		Product product = getProductByIdService(id);
		product.setStock(product.getStock() + stockAmount);
		product = productRepo.save(product);
		return "new inventory stock is " + product.getStock();
	}

	@Override
	@Transactional
	public String decProductStock(Long id, Integer stockAmount) {
		Product product = getProductByIdService(id);
		if (product.getStock() < stockAmount) {
			throw new RuntimeException("Insufficient stocks");
		}
		product.setStock(product.getStock() - stockAmount);
		product = productRepo.save(product);
		return "new inventory stock is " + product.getStock();
	}

}
