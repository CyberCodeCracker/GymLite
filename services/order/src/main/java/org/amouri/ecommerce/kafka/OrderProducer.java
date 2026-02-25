package org.amouri.ecommerce.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.amouri.ecommerce.DTOs.OrderConfirmation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderProducer {

    @Qualifier("orderKafkaTemplate")
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendOrderConfirmation(OrderConfirmation orderConfirmation) {

        log.info("=== ORDER PRODUCER ===");
        log.info("Sending to topic: order-topic");
        log.info("Message type: {}", orderConfirmation.getClass().getName());
        log.info("Payload: {}", orderConfirmation);

        Message<OrderConfirmation> message = MessageBuilder
                .withPayload(orderConfirmation)
                .setHeader(KafkaHeaders.TOPIC, "order-topic")
                .build()
                ;

        kafkaTemplate.send(message);
    }
}
