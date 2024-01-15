package org.jackpot.back.security.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;
@Getter
@AllArgsConstructor
public enum AuthErrorCode {
    NOT_EXISTS("유효하지 않은 정보입니다.", UNAUTHORIZED),
    PLZ_MORE_INFO("추가 정보가 더 필요합니다.", CONTINUE),
    DELETE_USER("삭제된 회원입니다.", NOT_FOUND),
    INACTIVE_USER("휴먼 회원입니다.", FORBIDDEN),
    NOT_FOUND_CODE("해당 이메일로 요청한 인증 코드가 없습니다.", BAD_REQUEST),
    DIFFERENT_NUMBER("인증 번호가 다릅니다.", BAD_REQUEST),
    ALREADY_JOIN_EMAIL("이미 가입된 메일입니다.", BAD_REQUEST);


    private final String message;
    private final HttpStatus httpStatus;
}
