package org.jackpot.back.security.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.security.model.dto.request.LoginRequest;
import org.jackpot.back.security.model.dto.request.RefreshTokenRequest;
import org.jackpot.back.security.model.service.AuthService;
import org.jackpot.back.security.model.service.TokenService;
import org.jackpot.back.user.model.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
    public ResponseEntity generateToken(
            @RequestBody LoginRequest loginRequest
            ){
        log.debug(loginRequest.toString());
        return ResponseEntity.ok(MessageUtils.success(authService.login(loginRequest.getEmail(),loginRequest.getPassword())));
    }

    /**
     * 토큰 재발행
     * @return GeneratedToken
     */
    @PostMapping("/refresh")
    public ResponseEntity<MessageUtils> refreshToken(
            @RequestBody RefreshTokenRequest refreshTokenRequest
            ){
        return ResponseEntity.ok(MessageUtils.success(tokenService.republishToken(refreshTokenRequest.getRefreshToken())));
    }

    /**
     * 토큰 만료
     * @param
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageUtils> logout(
            @AuthenticationPrincipal User user
            ){
        log.debug("userDto={}",user);
        tokenService.removeToken(user.getId());
        return ResponseEntity.ok(MessageUtils.success());
    }

}
