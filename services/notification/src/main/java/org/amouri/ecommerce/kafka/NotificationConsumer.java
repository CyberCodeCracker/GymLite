package org.amouri.ecommerce.kafka;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.amouri.ecommerce.DTOs.OrderConfirmation;
import org.amouri.ecommerce.DTOs.PaymentConfirmation;
import org.amouri.ecommerce.entities.Notification;
import org.amouri.ecommerce.enums.NotificationType;
import org.amouri.ecommerce.repositories.NotificationRepository;
import org.amouri.ecommerce.services.EmailService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository repository;
    private final EmailService emailService;

    @KafkaListener(topics = "payment-topic")
    public void consumePaymentSuccessNotification(PaymentConfirmation paymentConfirmation) throws MessagingException {

        log.info("Received Payment Confirmation:: {}", paymentConfirmation.toString());

        repository.save(
                Notification.builder()
                        .type(NotificationType.PAYMENT_CONFIRMATION)
                        .notificationDate(LocalDateTime.now())
                        .paymentConfirmation(paymentConfirmation)
                        .build()
        );

        var customerName = paymentConfirmation.getCustomerFirstName() + " " + paymentConfirmation.getCustomerLastName();

        emailService.sendPaymentSuccessEmail(
                paymentConfirmation.getCustomerEmail(),
                customerName,
                paymentConfirmation.getAmount(),
                paymentConfirmation.getOrderReference()
        );

    }

    @KafkaListener(topics = "order-topic")
    public void consumeOrderConfirmationNotification(OrderConfirmation orderConfirmation) throws MessagingException {

        log.info("Received order Confirmation:: {}", orderConfirmation.toString());

        repository.save(
                Notification.builder()
                        .type(NotificationType.ORDER_CONFIRMATION)
                        .notificationDate(LocalDateTime.now())
                        .orderConfirmation(orderConfirmation)
                        .build()
        );

        var customerName = orderConfirmation.getCustomer().firstName() + " " + orderConfirmation.getCustomer().lastName();

        emailService.sendOrderConfirmationEmail(
                orderConfirmation.getCustomer().email(),
                customerName,
                orderConfirmation.getTotalAmount(),
                orderConfirmation.getOrderReference(),
                orderConfirmation.getProduct()
        );

    }
}
