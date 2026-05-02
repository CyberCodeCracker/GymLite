package org.amouri.ecommerce.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.OrderRequest;
import org.amouri.ecommerce.DTOs.OrderResponse;
import org.amouri.ecommerce.enums.OrderStatus;
import org.amouri.ecommerce.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/customer/{customer-id}")
    public ResponseEntity<List<OrderResponse>> getByCustomerId(
            @PathVariable(name = "customer-id") String customerId
    ) {
        return ResponseEntity.ok(service.getByCustomerId(customerId));
    }

    @GetMapping("/{order-id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable(name = "order-id") Integer orderId
    ) {
        return ResponseEntity.ok(service.getById(orderId));
    }

    @PatchMapping("/{order-id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable(name = "order-id") Integer orderId,
            @RequestBody Map<String, String> body
    ) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(service.updateStatus(orderId, status));
    }
}
