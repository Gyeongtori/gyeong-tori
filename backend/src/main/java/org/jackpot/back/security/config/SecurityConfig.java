package org.jackpot.back.security.config;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.security.filter.JwtFilter;
import org.jackpot.back.security.handler.Oauth2AuthenticationSuccessHandler;
import org.jackpot.back.security.model.service.CustomOauth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    private static final String[] ALLOWED_URIS={
            "/v1/auth/login",
            "/v1/user/regist",
            "/v1/auth/refresh",
            "/v1/culturalheritage/oepn_api",
            "/v1/culturalheritage/list",
            "/v1/culturalheritage/redis_save",
            "/v1/card/redis_save",
            "/v1/card/add",
            "/v1/card/list",
            "/v1/dummy/list",
            //swagger 접근 위한 whitelist
            "/favicon.ico",
            "/error",
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            //health check
            "/actuator",
            "/api/",
    };
    //    private static final String[] ALLOWED_URIS={"/**"};
    private final JwtFilter jwtFilter;
    private final Oauth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;
    private final CustomOauth2UserService customOauth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(ALLOWED_URIS).permitAll() // 특정 경로 인증 미요구
                        .anyRequest().authenticated() // 나머지 경로는 인증 요구
                );

        httpSecurity.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2Login -> oauth2Login //소셜 로그인
                        .successHandler(oauth2AuthenticationSuccessHandler) // 로그인 성공했을 경우 handelr 처리
                        .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
                                .userService(customOauth2UserService)) //회원가입 or 업데이트 처리
                );
        return httpSecurity.build();
    }

}
