package org.jackpot.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.filter.ForwardedHeaderFilter;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {"org.jackpot.back.user.model.repository","org.jackpot.back.culturalHeritage.model.repository", "org.jackpot.back.card.model.repository"})
public class BackApplication {
    public static void main(String[] args) {

        SpringApplication.run(BackApplication.class, args);
    }

}
