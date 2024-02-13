package org.jackpot.back.security.config;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.security.filter.JwtFilter;
import org.jackpot.back.security.handler.Oauth2AuthenticationFailureHandler;
import org.jackpot.back.security.handler.Oauth2AuthenticationSuccessHandler;
import org.jackpot.back.security.model.service.CustomOauth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    private static final String[] ALLOWED_URIS={
            "/v1/auth/login",
            "/v1/email/**",
            "/v1/user/regist",
            "/v1/auth/refresh",
            "/v1/culturalheritage/**",
            "/v1/card/**",
            "/v1/dummy/**",
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
    private final Oauth2AuthenticationFailureHandler oauth2AuthenticationFailureHandler;
    private final CustomOauth2UserService customOauth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        httpSecurity
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(ALLOWED_URIS).permitAll() // 특정 경로 인증 미요구
                        .anyRequest().authenticated() // 나머지 경로는 인증 요구
                );

        httpSecurity
                .oauth2Login(oauth2Login -> oauth2Login //소셜 로그인
                                .successHandler(oauth2AuthenticationSuccessHandler) // 로그인 성공했을 경우 handelr 처리
                                .failureHandler(oauth2AuthenticationFailureHandler)
                                .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
                                                .userService(customOauth2UserService)
                                ) //회원가입 or 업데이트 처리
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
