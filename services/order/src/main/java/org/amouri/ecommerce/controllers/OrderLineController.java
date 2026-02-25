package org.amouri.ecommerce.controllers;

import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderLineResponse;
import org.amouri.ecommerce.services.OrderLineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order-line")
@RequiredArgsConstructor
public class OrderLineController {

    private final OrderLineService orderLineService;

    @GetMapping("/order/{order-id}")
    public ResponseEntity<List<OrderLineResponse>> getByOrderId(
            @PathVariable(value = "order-id") Integer orderId
    ) {
        return ResponseEntity.ok(orderLineService.getByOrderId(orderId));
    }
}
