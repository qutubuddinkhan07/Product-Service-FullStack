package com.product.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> getByCategory(String category);

	@Query("SELECT p FROM Product p WHERE p.price BETWEEN :start AND :end")
	Page<Product> getByRange(BigDecimal start, BigDecimal end, Pageable pageable);
}
