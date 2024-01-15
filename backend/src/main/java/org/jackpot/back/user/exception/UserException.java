package org.jackpot.back.user.exception;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException{
    private final UserErrorCode errorCode;
    public UserException(UserErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode=errorCode;
    }
}
