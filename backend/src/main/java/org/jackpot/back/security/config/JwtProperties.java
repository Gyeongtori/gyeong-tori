package org.jackpot.back.security.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "spring.jwt")
public class JwtProperties {
    private String refresh;
    private String access;
}
