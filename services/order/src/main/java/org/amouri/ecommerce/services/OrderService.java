package org.amouri.ecommerce.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderLineRequest;
import org.amouri.ecommerce.DTOs.OrderRequest;
import org.amouri.ecommerce.DTOs.PurchaseRequest;
import org.amouri.ecommerce.exception.BusinessException;
import org.amouri.ecommerce.interfaces.CustomerClient;
import org.amouri.ecommerce.mappers.OrderMapper;
import org.amouri.ecommerce.repositories.OrderRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerClient customerClient;
    private final ProductClient productClient;
    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final OrderLineService orderLineService;

    public Integer createOrder(@Valid OrderRequest request) {

        var customer = customerClient.findCustomerById(request.customerId())
                .orElseThrow(() -> new BusinessException("Cannot create order:: No customer exists with ID: " + request.customerId())
                );

        this.productClient.purchaseProducts(request.products());

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

        return null;
    }
}
