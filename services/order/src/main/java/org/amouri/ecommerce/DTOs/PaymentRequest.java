package org.amouri.ecommerce.DTOs;

import org.amouri.ecommerce.enums.PaymentMethod;

import java.math.BigDecimal;

public record PaymentRequest(
        BigDecimal amount,
        PaymentMethod paymentMethod,
        Integer orderId,
        String orderReference,
        CustomerPaymentRequest customer
) {
}
