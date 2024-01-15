package org.jackpot.back.security.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.security.exception.AuthException;
import org.jackpot.back.security.model.dto.response.GeneratedToken;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.entity.enums.UserStatus;
import org.jackpot.back.user.model.service.UserService;
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

    public GeneratedToken login(String email, String password){
        User user = userService.findByEmail(email);
        log.info("user : "+user.toString());
        if (user!=null && passwordEncoder.matches(password, user.getPassword())){
            if (user.getStatus().equals(UserStatus.ACTIVE)){
                GeneratedToken generatedToken = tokenService.generatedToken(user.getId());
                if (user.getName().equals("미기입")) {
                    generatedToken.setStatus(1);
                }
                return generatedToken;
            }
            if (user.getStatus().equals(UserStatus.DELETED))throw new AuthException(DELETE_USER);
            if (user.getStatus().equals(UserStatus.INACTIVE))throw new AuthException(INACTIVE_USER);
        }
        throw new AuthException(NOT_EXISTS);
    }


}
