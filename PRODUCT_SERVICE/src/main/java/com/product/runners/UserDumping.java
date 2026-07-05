package com.product.runners;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.product.entity.User;
import com.product.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDumping implements CommandLineRunner {
	private final UserRepository userRepo;
	private final PasswordGenerator passwordGenerator;

	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		int countUser = (int) userRepo.count();

		if (countUser < 1) {
			String pass = passwordGenerator.generatePass("123456789");
			String username = "admin";
			String userEmail = "admin123@example.com";
			String role = "ADMIN";
			User user = User.builder().name(username).email(userEmail).password(pass).role(role)
					.createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
			userRepo.save(user);
			log.info("User created with: Name= " + username + " Email= " + userEmail + " Password= " + pass);
		}
		log.info("Users are already present");
	}

}
