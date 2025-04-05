package com.taxi.driver.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class VerificationApprovedException extends RuntimeException{
    public VerificationApprovedException(String message){
        super(message);
    }
}
