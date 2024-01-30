package org.jackpot.back.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jackpot.back.security.model.dto.oauth.OAuth2UserInfo;
import org.jackpot.back.security.model.dto.response.GeneratedToken;
import org.jackpot.back.security.model.service.CustomOauth2UserService;
import org.jackpot.back.security.model.service.TokenService;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

// 사용자의 인증이 성공한 후 수행할 로직 정의
// ex) 사용자를 특정 페이지로 리디렉션하거나, 인증 성공 후 추가적인 정보를 로깅하거나, 사용자의 세션에 특정 정보를 추가하는 등의 작업
@Component
@RequiredArgsConstructor
public class Oauth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final CustomOauth2UserService customOauth2UserService;
    private final UserService userService;
    private final TokenService tokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //사용자 정보 불러오기
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        String registrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(); //google, naver, kakao 확인

        //사용자 DB에 존재하면
        OAuth2UserInfo oAuth2UserInfo = customOauth2UserService.getOAuth2UserInfo(oAuth2User, registrationId);
        User findUser = userService.findByEmail(oAuth2UserInfo.getEmail());

        //토큰 쿠키에 저장
        if(findUser!=null){
            GeneratedToken generatedToken = tokenService.generatedToken(findUser.getId());

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
        }


    }
}
