package org.jackpot.back.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.security.exception.JwtException;
import org.jackpot.back.user.exception.UserException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(UserException.class)
    public ResponseEntity userExceptionHandler(UserException e){
        log.debug(Arrays.toString(e.getStackTrace()));
        return ResponseEntity.status(e.getErrorCode().getHttpStatus())
                .body(MessageUtils.fail(String.valueOf(e.getErrorCode()),e.getMessage()));
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity jwtExceptionHandler(JwtException e){
        log.debug(Arrays.toString(e.getStackTrace()));
        return ResponseEntity.status(e.getErrorCode().getHttpStatus())
                .body(MessageUtils.fail(String.valueOf(e.getErrorCode()),e.getMessage()));
    }
}
