package org.amouri.ecommerce.mappers;

import org.amouri.ecommerce.DTOs.OrderLineRequest;
import org.amouri.ecommerce.entities.Order;
import org.amouri.ecommerce.entities.OrderLine;
import org.springframework.stereotype.Service;

@Service
public class OrderLineMapper {

    public OrderLine toOrderLine(OrderLineRequest request) {
        return OrderLine.builder()
                .id(request.id())
                .order(
                        Order.builder()
                                .id(request.orderId())
                                .build()
                )
                .productId(request.productId())
                .quantity(request.quantity())
                .build();
    }
}
