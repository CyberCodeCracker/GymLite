package org.amouri.ecommerce.interfaces;

import org.amouri.ecommerce.DTOs.PaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "payment-service",
        url = "${application.config.payment-url}"
)
public interface PaymentClient {

    @PostMapping
    Integer createPayment(@RequestBody PaymentRequest paymentRequest);
}
