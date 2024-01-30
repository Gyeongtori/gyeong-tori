package org.jackpot.back.security.model.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.security.exception.AuthException;
import org.jackpot.back.security.model.dto.response.GeneratedToken;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.entity.enums.UserStatus;
import org.jackpot.back.user.model.service.UserService;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.jackpot.back.security.exception.AuthErrorCode.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    //todo : 일반 로그인, 소셜 로그인 등의 인증 로직이 들어갑니다.

    public void login(HttpServletResponse response, String email, String password){
        User user = userService.findByEmail(email);
        log.info("user : "+user.toString());
        if (user!=null && passwordEncoder.matches(password, user.getPassword())){
            if (user.getStatus().equals(UserStatus.ACTIVE)){
                GeneratedToken generatedToken = tokenService.generatedToken(user.getId());
                if (user.getUsername().equals("미기입")) {
                    generatedToken.setStatus(1);
                }
                //Todo 생성한 토큰 쿠키에 넣기
                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", generatedToken.getRefreshToken())
                        // 토큰의 유효 기간
                        .maxAge(7 * 24 * 60 * 60) //7일
                        .path("/")
                        // https 환경에서만 쿠키가 발동합니다.
                        .secure(true)
                        // 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
                        .sameSite("None")
                        .httpOnly(true)
                        // 브라우저에서 쿠키에 접근할 수 없도록 제한
                        .build();
                response.addHeader("Set-Cookie", refreshTokenCookie.toString());

                ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", generatedToken.getAccessToken())
                        // 토큰의 유효 기간
                        .maxAge(60 * 30) //30분
                        .path("/")
                        // https 환경에서만 쿠키가 발동합니다.
                        .secure(true)
                        // 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
                        .sameSite("None")
                        .httpOnly(false)
                        // 브라우저에서 쿠키에 접근할 수 없도록 제한
                        .build();
                response.addHeader("Set-Cookie", accessTokenCookie.toString());
                return;
            }
            if (user.getStatus().equals(UserStatus.DELETED))throw new AuthException(DELETE_USER);
            if (user.getStatus().equals(UserStatus.INACTIVE))throw new AuthException(INACTIVE_USER);
        }
        throw new AuthException(NOT_EXISTS);
    }


}
