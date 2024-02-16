package org.jackpot.back.security.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.security.exception.JwtErrorCode;
import org.jackpot.back.security.model.dto.request.LoginRequest;
import org.jackpot.back.security.model.dto.request.RefreshTokenRequest;
import org.jackpot.back.security.model.dto.response.GeneratedToken;
import org.jackpot.back.security.model.service.AuthService;
import org.jackpot.back.security.model.service.TokenService;
import org.jackpot.back.user.model.entity.User;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/auth")
public class AuthController {
    private final TokenService tokenService;
    private final AuthService authService;


    /**
     *
     * @param loginRequest
     * @return GeneratedToken
     */
    @PostMapping("/login")
    public ResponseEntity generateToken(@RequestBody LoginRequest loginRequest, HttpServletResponse response){
        log.debug(loginRequest.toString());
        authService.login(response, loginRequest.getEmail(),loginRequest.getPassword());
        return ResponseEntity.ok(MessageUtils.success());
    }

    /**
     * 토큰 재발행
     * @return GeneratedToken
     */
    @GetMapping("/refresh")
    public ResponseEntity<MessageUtils> refreshToken(HttpServletRequest request, HttpServletResponse response){
        String refreshToken=null;

        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies){
            if("refreshToken".equals(cookie.getName())){
                refreshToken = cookie.getValue();
                break;
            }
        }
        GeneratedToken newToken = tokenService.republishToken(refreshToken);
        ResponseCookie refreshTokenCookie=null;
        ResponseCookie accessTokenCookie=null;
        if(newToken == null){
            refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                    // 토큰의 유효 기간
                    .maxAge(0) //expire
                    .path("/")
                    // https 환경에서만 쿠키가 발동합니다.
                    .secure(true)
                    // 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
                    .sameSite("None")
                    .httpOnly(true)
                    // 브라우저에서 쿠키에 접근할 수 없도록 제한
                    .build();
            response.addHeader("Set-Cookie", refreshTokenCookie.toString());
            return ResponseEntity.status(JwtErrorCode.INVALID_TOKEN.getHttpStatus())
                    .body(MessageUtils.fail(JwtErrorCode.INVALID_TOKEN.getHttpStatus().name(),JwtErrorCode.INVALID_TOKEN.getMessage()));
        } else {
            refreshTokenCookie = ResponseCookie.from("refreshToken", newToken.getRefreshToken())
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
            accessTokenCookie = ResponseCookie.from("accessToken", newToken.getAccessToken())
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
            response.addHeader("Set-Cookie", refreshTokenCookie.toString());
            return ResponseEntity.ok(MessageUtils.success());
        }
    }

    /**
     * 토큰 만료
     * @param
     * @return
     */
    @GetMapping("/logout")
    public ResponseEntity<MessageUtils> logout(
            @AuthenticationPrincipal User user,
            HttpServletRequest request,
            HttpServletResponse response
    ){
        String accessToken=null;
        String refreshToken=null;

        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies){
            if("accessToken".equals(cookie.getName())){
                accessToken = cookie.getValue();
                continue;
            }
            if("refreshToken".equals(cookie.getName())){
                refreshToken = cookie.getValue();
                continue;
            }
        }

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                // 토큰의 유효 기간
                .maxAge(0) //expire
                .path("/")
                // https 환경에서만 쿠키가 발동합니다.
                .secure(true)
                // 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
                .sameSite("None")
                .httpOnly(true)
                // 브라우저에서 쿠키에 접근할 수 없도록 제한
                .build();


        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken",accessToken)
                // 토큰의 유효 기간
                .maxAge(0) //expire
                .path("/")
                // https 환경에서만 쿠키가 발동합니다.
                .secure(true)
                // 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
                .sameSite("None")
                .httpOnly(false)
                // 브라우저에서 쿠키에 접근할 수 없도록 제한
                .build();


        //redis에서 토큰 제거
        tokenService.removeToken(user.getId());

        //쿠키에서 토큰 만료
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        response.addHeader("Set-Cookie", accessTokenCookie.toString());

        return ResponseEntity.ok(MessageUtils.success());
    }

}
