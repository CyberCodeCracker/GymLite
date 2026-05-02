package org.amouri.ecommerce.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.*;
import org.amouri.ecommerce.entities.Order;
import org.amouri.ecommerce.enums.OrderStatus;
import org.amouri.ecommerce.exception.BusinessException;
import org.amouri.ecommerce.interfaces.CustomerClient;
import org.amouri.ecommerce.interfaces.PaymentClient;
import org.amouri.ecommerce.kafka.OrderProducer;
import org.amouri.ecommerce.mappers.OrderMapper;
import org.amouri.ecommerce.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerClient customerClient;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final OrderLineService orderLineService;
    private final OrderProducer orderProducer;

    public Integer createOrder(@Valid OrderRequest request) {

        var customer = customerClient.findCustomerById(request.customerId())
                .orElseThrow(() -> new BusinessException("Cannot create order:: No customer exists with ID: " + request.customerId())
                );

        var purchasedProducts = this.productClient.purchaseProducts(request.products());

        var order = mapper.toOrder(request);
        order.setReference("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order = this.repository.save(order);

        for (PurchaseRequest purchaseRequest: request.products()){
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            null,
                            order.getId(),
                            purchaseRequest.id(),
                            purchaseRequest.availableQuantity()
                    )
            );

        }

        paymentClient.createPayment(
                new PaymentRequest(
                        request.totalAmount(),
                        request.paymentMethod(),
                        order.getId(),
                        order.getReference(),
                        new CustomerPaymentRequest(
                                customer.firstName(),
                                customer.lastName(),
                                customer.email()
                        )
                )
        );

        orderProducer.sendOrderConfirmation(
                new OrderConfirmation(
                        request.reference(),
                        request.totalAmount(),
                        request.paymentMethod(),
                        customer,
                        purchasedProducts
                )
        );
        
        return order.getId();
    }

    public List<OrderResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getByCustomerId(String customerId) {
        return repository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(mapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getById(Integer orderId) {
        var order = getOrderById(orderId);
        return mapper.toOrderResponse(order);
    }

    public OrderResponse updateStatus(Integer orderId, OrderStatus status) {
        var order = getOrderById(orderId);
        order.setStatus(status);
        repository.save(order);
        return mapper.toOrderResponse(order);
    }

    private Order getOrderById(Integer orderId) {
        return repository.findById(orderId)
                 .orElseThrow(
                        () -> new EntityNotFoundException("Cannot get order:: No order exists with ID: " + orderId)
                );
    }
}
