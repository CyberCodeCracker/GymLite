package org.amouri.ecommerce.DTOs;

import lombok.Getter;
import lombok.Setter;
import org.amouri.ecommerce.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public record OrderConfirmation(
        String orderReference,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        CustomerResponse customer,
        List<PurchaseResponse> products
) {
}
