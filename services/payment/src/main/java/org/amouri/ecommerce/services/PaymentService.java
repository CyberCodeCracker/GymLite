package org.amouri.ecommerce.services;

import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.PaymentNotificationRequest;
import org.amouri.ecommerce.DTOs.PaymentRequest;
import org.amouri.ecommerce.kafka.NotificationProducer;
import org.amouri.ecommerce.mappers.PaymentMapper;
import org.amouri.ecommerce.repositories.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper mapper;
    private final NotificationProducer notificationProducer;

    public Integer createPayment(PaymentRequest request) {

        var payment = paymentRepository.save(mapper.toPayment(request));

        notificationProducer.sendNotification(
                new PaymentNotificationRequest(
                        request.orderReference(),
                        request.amount(),
                        request.paymentMethod(),
                        request.customer().firstName(),
                        request.customer().lastName(),
                        request.customer().email()
                )
        );

        return payment.getId();

    }
}
