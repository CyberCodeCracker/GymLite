package org.amouri.ecommerce.services;

import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderLineRequest;
import org.amouri.ecommerce.DTOs.OrderLineResponse;
import org.amouri.ecommerce.mappers.OrderLineMapper;
import org.amouri.ecommerce.repositories.OrderLineRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderLineService {

    private final OrderLineRepository orderLineRepository;
    private final OrderLineMapper orderLineMapper;

    public Integer saveOrderLine(OrderLineRequest orderLineRequest) {

        var orderLine = orderLineMapper.toOrderLine(orderLineRequest);
        return orderLineRepository.save(orderLine).getId();
    }

    public List<OrderLineResponse> getByOrderId(
            Integer orderId
    ) {
        return orderLineRepository.getByOrderId(orderId)
                .stream()
                .map(orderLineMapper::toOrderLineResponse)
                .collect(Collectors.toList())
                ;
    }
}
