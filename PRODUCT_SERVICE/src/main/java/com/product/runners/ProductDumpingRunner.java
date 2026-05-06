package com.product.runners;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.product.entity.Product;
import com.product.enums.ProductTypes;
import com.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class ProductDumpingRunner implements CommandLineRunner {

	private final ProductRepository productRepository;
	private final Random random;

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		ProductTypes[] categories = ProductTypes.values();
		long presentNumber = productRepository.count();
		long required = 200 - presentNumber;
		List<Product> products = new ArrayList<>();
		while (required-- > 0) {
			Product product = Product.builder().name(UUID.randomUUID().toString().substring(0, 10))
					.description(UUID.randomUUID().toString().substring(0, 23))
					.brand(UUID.randomUUID().toString().substring(0, 10))
					.category(categories[random.nextInt(0, categories.length)].name()).stock(random.nextInt(1, 100))
					.price(new BigDecimal(random.nextDouble(1, 10000))).isActive(true).createdAt(LocalDateTime.now())
					.updatedAt(LocalDateTime.now()).build();
			products.add(product);

			productRepository.saveAll(products);
		}
	}

}
