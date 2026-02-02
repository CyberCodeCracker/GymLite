package org.amouri.ecommerce.services;

import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderLineRequest;
import org.amouri.ecommerce.mappers.OrderLineMapper;
import org.amouri.ecommerce.repositories.OrderLineRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderLineService {

    private final OrderLineRepository orderLineRepository;
    private final OrderLineMapper orderLineMapper;

    public Integer saveOrderLine(OrderLineRequest orderLineRequest) {

        var orderLine = orderLineMapper.toOrderLine(orderLineRequest);
        return orderLineRepository.save(orderLine).getId();
    }
}
