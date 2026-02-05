package org.amouri.ecommerce.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderRequest;
import org.amouri.ecommerce.DTOs.OrderResponse;
import org.amouri.ecommerce.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public ResponseEntity<Integer> createOrder(
            @RequestBody @Valid OrderRequest request
    ) {
        return ResponseEntity.ok(service.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{order-id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Integer orderId
    ) {
        return ResponseEntity.ok(service.getById(orderId));
    }


}
