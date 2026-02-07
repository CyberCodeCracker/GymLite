package org.amouri.ecommerce.mappers;

import org.amouri.ecommerce.DTOs.PaymentRequest;
import org.amouri.ecommerce.entities.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentMapper {

    public Payment toPayment(PaymentRequest request) {
        return Payment.builder()
                .id(request.id())
                .amount(request.amount())
                .orderId(request.orderId())
                .paymentMethod(request.paymentMethod())
                .build()
                ;
    }
}
