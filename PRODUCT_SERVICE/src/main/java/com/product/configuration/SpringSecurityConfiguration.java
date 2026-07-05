package com.product.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.product.filter.JWTFilter;

@Configuration
public class SpringSecurityConfiguration {
	@Autowired
	private JWTFilter jwtFilter;

	@Bean
	public SecurityFilterChain configureFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/v3/auth/**", "/api/v2/user/**", "/swagger-ui/**", "/swagger-ui.html",
								"/v3/api-docs/**")
						.permitAll().requestMatchers("/api/v1.0/product/**").hasAuthority("ROLE_ADMIN").anyRequest()
						.authenticated())
				.formLogin(form -> form.disable()).httpBasic(basic -> basic.disable());

		// 🔥 REGISTER FILTER HERE
		http.addFilterBefore(jwtFilter,
				org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

		org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

		// config.setAllowedOriginPatterns(List.of("*")); // ✅ your frontend

		config.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://localhost:5173",
				"https://*.ngrok-free.app", "https://*.ngrok.io", "https://*.netlify.app"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", config);

		return source;
	}

	@Bean
	public PasswordEncoder creatPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager createAuthManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
