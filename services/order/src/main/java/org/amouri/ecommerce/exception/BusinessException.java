package org.amouri.ecommerce.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper=true)
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
