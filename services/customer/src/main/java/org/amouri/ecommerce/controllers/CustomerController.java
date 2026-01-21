package org.amouri.ecommerce.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.CustomerRequest;
import org.amouri.ecommerce.DTOs.CustomerResponse;
import org.amouri.ecommerce.services.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;
    @PostMapping
    public ResponseEntity<Integer> createCustomer(
            @RequestBody @Valid CustomerRequest request
    ) {
       return ResponseEntity.ok(service.createCustomer(request));
    }

    @PutMapping
    public ResponseEntity<Integer> updateCustomer(
            @RequestBody @Valid CustomerRequest request,
            @RequestParam int id
    ) {
        service.updateCustomer(request, id);
        return ResponseEntity.accepted().build();
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> findAll() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @GetMapping("/exists/{customer-id}")
    public ResponseEntity<Boolean> existsById(
            @PathVariable("customer-id") Integer id
    ) {
        return ResponseEntity.ok(service.existsById(id));
    }

    @GetMapping("/{customer-id}")
    public ResponseEntity<CustomerResponse> findCustomerById(
            @PathVariable("customer-id") Integer id
    ) {
        return ResponseEntity.ok(service.findById(id));
    }

    @DeleteMapping("/{customer-id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable("customer-id") Integer id
    ) {
        service.deleteById(id);
        return ResponseEntity.accepted().build();
    }
}
