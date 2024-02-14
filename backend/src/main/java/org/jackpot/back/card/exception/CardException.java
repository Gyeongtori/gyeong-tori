package org.jackpot.back.card.exception;

import lombok.Getter;

@Getter
public class CardException extends RuntimeException{
    private final CardErrorCode errorCode;
    public CardException(CardErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode=errorCode;
    }
}
