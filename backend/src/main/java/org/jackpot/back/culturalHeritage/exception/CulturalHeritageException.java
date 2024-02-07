package org.jackpot.back.culturalHeritage.exception;

import lombok.Getter;

@Getter
public class CulturalHeritageException extends RuntimeException{
    private final CulturalHeritageErrorCode errorCode;
    public CulturalHeritageException(CulturalHeritageErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode=errorCode;
    }
}
