package com.example.Kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.Kanban", "config", "models", "repository", "services"})
@EntityScan(basePackages = "models")
@EnableJpaRepositories(basePackages = "repository")
@ComponentScan(basePackages = {"controllers", "services", "repository", "config"})
public class KanbanApplication {
	public static void main(String[] args) {
		SpringApplication.run(KanbanApplication.class, args);
	}
}