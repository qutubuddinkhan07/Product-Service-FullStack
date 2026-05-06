package com.product.runners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import com.product.service.MailService;

//@Component
public class MailTestRunner implements CommandLineRunner {
	@Autowired
	private MailService mailService;

	@Override
	public void run(String... args) throws Exception {
		// mailService.sentEmail("qutubuddink267@gmail.com", "Chalu");
	}

}
