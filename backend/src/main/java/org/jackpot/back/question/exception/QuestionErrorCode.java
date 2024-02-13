package org.jackpot.back.question.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Getter
@AllArgsConstructor
public enum QuestionErrorCode {
    NOT_EXISTS("존재하는 정보입니다.", BAD_REQUEST),
    TRANSACTION_FAIL("트랜젝션에 실패했습니다.", BAD_REQUEST);

    private final String message;
    private final HttpStatus httpStatus;
}
