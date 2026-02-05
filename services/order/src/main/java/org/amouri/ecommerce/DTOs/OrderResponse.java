package org.amouri.ecommerce.DTOs;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.amouri.ecommerce.enums.PaymentMethod;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record OrderResponse(
        Integer id,
        String reference,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        Integer customerId
) {
}
