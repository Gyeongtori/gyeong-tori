package org.jackpot.back.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.security.exception.JwtErrorCode;
import org.jackpot.back.security.utils.JwtUtil;
import org.jackpot.back.user.exception.UserErrorCode;
import org.jackpot.back.user.exception.UserException;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@RequiredArgsConstructor
@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    public static final String BEARER_PREFIX = "Bearer_";
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader=null;
        log.debug("========= jwt filter =========");
        Cookie[] cookies = request.getCookies();
        log.debug(Arrays.toString(cookies));
        if(cookies!=null){
            for(Cookie cookie : cookies){
                if("accessToken".equals(cookie.getName())){
                    authHeader = cookie.getValue();
                    break;

                }
            }
        }

        //access token이 없는 경우
        if(!StringUtils.hasText(authHeader)){
            log.debug("ACCESS DENIED : "+"헤더가 없습니다.");
//            jwtExceptionHandler(response,objectMapper,JwtErrorCode.NO_TOKEN);
            doFilter(request,response,filterChain);
            return;
        }
        //access token request 형식 오류 Bearer token
        if(!authHeader.startsWith(BEARER_PREFIX)){
            log.debug("ACCESS DENIED : "+"bearer 형식이 잘못되었습니다.");
//            jwtExceptionHandler(response,objectMapper,JwtErrorCode.NOT_SUPPORT_TOKEN);
            doFilter(request,response,filterChain);
            return;
        }
        //access token 추출
        String authToken=authHeader.substring(7);

        //access token 검증
        Jws<Claims> claimsJws = jwtUtil.validateAccessToken(authToken);
        System.out.println(jwtUtil.getUserIdFromAccessToken(authToken));
        if(claimsJws!=null){
            Optional<User> user=null;
            user=userRepository.findById(jwtUtil.getUserIdFromAccessToken(authToken));
            if(user.isEmpty()){
//                userExceptionHandler(response,objectMapper,UserErrorCode.NOT_EXISTS_USER);
                doFilter(request,response,filterChain);
                return;
            }
            System.out.println(user.get().toString());
            Authentication authentication=new UsernamePasswordAuthenticationToken(user.get(), null, user.get().getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request,response);
    }

    /**
     * exception handlers
     * @param response
     * @param objectMapper
     * @param errorCode
     * @throws IOException
     */
    public void userExceptionHandler(HttpServletResponse response,ObjectMapper objectMapper,UserErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        log.info("user fail");
        response.getWriter().write(objectMapper.writeValueAsString(MessageUtils.fail(errorCode.name(),errorCode.getMessage())));
    }
    public void jwtExceptionHandler(HttpServletResponse response, ObjectMapper objectMapper, JwtErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        log.info("jwt fail");
        response.getWriter().write(objectMapper.writeValueAsString(MessageUtils.fail(errorCode.name(),errorCode.getMessage())));
    }
}
