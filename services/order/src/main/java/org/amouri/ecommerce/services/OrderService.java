package org.amouri.ecommerce.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.*;
import org.amouri.ecommerce.entities.Order;
import org.amouri.ecommerce.exception.BusinessException;
import org.amouri.ecommerce.interfaces.CustomerClient;
import org.amouri.ecommerce.interfaces.PaymentClient;
import org.amouri.ecommerce.kafka.OrderProducer;
import org.amouri.ecommerce.mappers.OrderMapper;
import org.amouri.ecommerce.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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

        var order = this.repository.save(mapper.toOrder(request));

        for (PurchaseRequest purchaseRequest: request.products()){
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            null,
                            order.getId(),
                            purchaseRequest.productId(),
                            purchaseRequest.quantity()
                    )
            );

        }

        paymentClient.createPayment(
                new PaymentRequest(
                        request.totalAmount(),
                        request.paymentMethod(),
                        order.getId(),
                        order.getReference(),
                        customer
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
                .collect(Collectors.toList())
                ;
    }

    public OrderResponse getById(Integer orderId) {
        var order = getorderById(orderId);
        return mapper.toOrderResponse(order);
    }

    private Order getorderById(Integer orderId) {
        return repository.findById(orderId)
                 .orElseThrow(
                        () -> new EntityNotFoundException("Cannot get order:: No order exists with ID: " + orderId)
                );
    }
}
