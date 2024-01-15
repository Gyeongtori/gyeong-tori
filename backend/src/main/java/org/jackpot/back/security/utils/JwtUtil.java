package org.jackpot.back.security.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.security.config.JwtProperties;
import org.jackpot.back.security.exception.JwtErrorCode;
import org.jackpot.back.security.exception.JwtException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.Date;

@RequiredArgsConstructor
@Service
@Slf4j
public class JwtUtil {
    private final JwtProperties jwtProperties;
    private static final Long refreshPeriod = 1000L * 60L * 60L * 24L * 7;
    private static final Long accessPeriod = 1000L * 60L * 30L;
    private static final ZoneId zoneId = ZoneId.of("Asia/Seoul");
    private String accessSecretKey;
    private String refreshSecretKey;

    //의존성 주입 후 acccessSecretKey, refreshSecretKey 생성
    @PostConstruct
    protected void init(){
        accessSecretKey = Base64.getEncoder().encodeToString(
                jwtProperties.getAccess().getBytes()
        );
        refreshSecretKey = Base64.getEncoder().encodeToString(
                jwtProperties.getRefresh().getBytes()
        );
    }

    /**
     * 발행 시간
     * @return
     */
    public Date getIssuedDate(){
        return Date.from(ZonedDateTime.now(zoneId)
                .toInstant());
    }

    /**
     * 만료 시간
     * @param period
     * @return
     */
    public Date getExpireDate(Long period){
        return Date.from(ZonedDateTime.now(zoneId)
                .plus(Duration.ofMillis(period))
                .toInstant());
    }


    /**
     * 액세스 토큰 생성
     */
    public String generateAccessToken(Long id){
        return Jwts.builder()
                .setSubject(String.valueOf(id))
                .setIssuedAt(getIssuedDate())
                .setExpiration(getExpireDate(accessPeriod))
                .signWith(SignatureAlgorithm.HS256,accessSecretKey)
                .compact();
    }

    /**
     * 리프레쉬 토큰 생성
     */
    public String generateRefreshToken(Long id){
        return Jwts.builder()
                .setSubject(String.valueOf(id))
                .setIssuedAt(getIssuedDate())
                .setExpiration(getExpireDate(refreshPeriod))
                .signWith(SignatureAlgorithm.HS256,refreshSecretKey)
                .compact();
    }



    /**
     * 엑세스 토큰 검증
     */
    public Jws<Claims> validateAccessToken(final String token) {
        try {
            return Jwts.parser().setSigningKey(accessSecretKey).parseClaimsJws(token);
        } catch (SignatureException | MalformedJwtException e) {
            log.info("exception : 잘못된 엑세스 토큰 시그니처");
            throw new JwtException(JwtErrorCode.TOKEN_SIGNATURE_ERROR);
        } catch (ExpiredJwtException e) {
            log.info("exception : 엑세스 토큰 기간 만료");
            throw new JwtException(JwtErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            log.info("exception : 지원되지 않는 엑세스 토큰");
            throw new JwtException(JwtErrorCode.NOT_SUPPORT_TOKEN);
        } catch (IllegalArgumentException e) {
            log.info("exception : 잘못된 엑세스 토큰");
            throw new JwtException(JwtErrorCode.INVALID_TOKEN);
        }
    }
    /**
     * 리프레쉬 토큰 검증
     */
    public Jws<Claims> validateRefreshToken(final String token) {
        try {
            return Jwts.parser().setSigningKey(refreshSecretKey).parseClaimsJws(token);
        } catch (SignatureException | MalformedJwtException e) {
            log.info("exception : 잘못된 리프레쉬 토큰 시그니처");
            throw new JwtException(JwtErrorCode.TOKEN_SIGNATURE_ERROR);
        } catch (ExpiredJwtException e) {
            log.info("exception : 리프레쉬 토큰 기간 만료");
            throw new JwtException(JwtErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            log.info("exception : 지원되지 않는 리프레쉬 토큰");
            throw new JwtException(JwtErrorCode.NOT_SUPPORT_TOKEN);
        } catch (IllegalArgumentException e) {
            log.info("exception : 잘못된 리프레쉬 토큰");
            throw new JwtException(JwtErrorCode.INVALID_TOKEN);
        }
    }

    /**
     * 액세스 토큰 subject(사용자 id) 가져오기
     */
    public Long getUserIdFromAccessToken(String accessToken){
        return Long.valueOf(
                Jwts.parserBuilder()
                        .setSigningKey(accessSecretKey)
                        .build()
                        .parseClaimsJws(accessToken)
                        .getBody()
                        .getSubject()
        );
    }

    /**
     * refresh 토큰 subject(사용자 id) 가져오기
     * @param refreshToken
     * @return
     */
    public Long getUserIdFromRefreshToken(String refreshToken){
        return Long.valueOf(
                Jwts.parserBuilder()
                        .setSigningKey(refreshSecretKey)
                        .build()
                        .parseClaimsJws(refreshToken)
                        .getBody()
                        .getSubject()
        );
    }

}
