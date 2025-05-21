package com.example.einternmatchback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication

@EnableScheduling
@ComponentScan(basePackages = "com.example.einternmatchback")
@EnableJpaRepositories(basePackages = "com.example.einternmatchback")
@EntityScan(basePackages = "com.example.einternmatchback")
public class   AuthsecApplication {

	public static void main(String[] args) {

		SpringApplication.run(AuthsecApplication.class, args);
	}

}
