package org.jackpot.back.security.config;

import lombok.Data;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Data
@Configuration
public class EmailConfig {
    @Value("${spring.mail.default-encoding}")
    private String defaultEncoding;
    @Value("${spring.mail.host}")
    private String host;
    @Value("${spring.mail.port}")
    private int port;
    @Value("${spring.mail.username}")
    private String userName;
    @Value("${spring.mail.password}")
    private String password;
    @Value("${spring.mail.properties.mail.smtp.auth}")
    private boolean auth;
    @Value("${spring.mail.properties.mail.smtp.timeout}")
    private int timeout;
    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private boolean starttls;


    @Bean
    public JavaMailSender javaMailService(){
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(host);
        javaMailSender.setPort(port);
        javaMailSender.setUsername(userName);
        javaMailSender.setPassword(password);
        javaMailSender.setJavaMailProperties(getMailProperties());
        javaMailSender.setDefaultEncoding(defaultEncoding);
        return javaMailSender;
    }

    private Properties getMailProperties(){
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", auth);
        properties.put("mail.smtp.timeout", timeout);
        properties.put("mail.smtp.starttls.enable", starttls);
        return properties;
    }
}
