package org.jackpot.back.security.model.service;


import lombok.RequiredArgsConstructor;
import org.jackpot.back.security.exception.JwtErrorCode;
import org.jackpot.back.security.exception.JwtException;
import org.jackpot.back.security.model.dto.response.GeneratedToken;
import org.jackpot.back.security.model.entity.Token;
import org.jackpot.back.security.repository.RefreshTokenRepository;
import org.jackpot.back.security.utils.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.jackpot.back.security.exception.JwtErrorCode.NOT_EXISTS_TOKEN;


@Service
@RequiredArgsConstructor
public class TokenService {

    private final RefreshTokenRepository repository;
    private final JwtUtil jwtUtil;

    /**
     * 토큰 생성
     */
    @Transactional
    public GeneratedToken generatedToken(Long userId){
        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);
        //레디스 저장
        repository.save(new Token(userId, accessToken, refreshToken));
        return GeneratedToken.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * @param userId
     */
    @Transactional
    public void removeToken(Long userId){
        Token token = repository.findById(userId)
                .orElseThrow(()-> new JwtException(NOT_EXISTS_TOKEN));
        //todo : 로그아웃 시 처리 해야하는 레디스에 저장된 user 정보 예) 알람 등

        repository.delete(token);
    }

    /**
     * 엑세스토큰을 받아서 재 발행 해주는 역할입니다.
     * @Refresh Token Rotation : access token, refresh Token 재 발행
     * @return newAccessToken
     */
    @Transactional
    public GeneratedToken republishToken(String refreshToken){
//        refreshToken 검증
        if (jwtUtil.validateRefreshToken(refreshToken)!=null){
//          1. 정상유저(A)의 Refresh Token에서 User의 정보(email or PK)를 꺼낸다.
            Long userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);
//          2. user email or PK 를 통해 Redis를 조회한다.
            Token token = repository.findById(userId).orElseThrow(() -> new JwtException(NOT_EXISTS_TOKEN));
//          3. 정상적으로 조회된다면 해당 user의 refresh token(value)를 가져올 수 잇다.
//          4. Redis에서 조회한 refresh token과 클라이어트가 보낸 refresh Token을 비교한다.
            if (refreshToken.equals(token.getRefreshToken())){
//              5. 두 토큰 값이 매칭되면 정상 유저로 간주하고, access token과 refresh token을 모두 재발급한다.
                GeneratedToken newToken = generatedToken(userId);
//              6. Redis에 저장된 user email의 매핑 값을(새 refresh token)으로 갱신한다.
                removeToken(userId);
                repository.save(new Token(userId, newToken.getAccessToken(), newToken.getRefreshToken()));
                return newToken;
            }else {
                //사용자가 아닌 다른 사람에 의해 토큰이 변경됨
                removeToken(userId);
                //todo : 두 토큰 다 블랙리스트 처리 들어가야함.-> 이후 재 로그인

                throw new JwtException(JwtErrorCode.INVALID_TOKEN);
            }
        }
        throw new JwtException(JwtErrorCode.INVALID_TOKEN);
    }

}
