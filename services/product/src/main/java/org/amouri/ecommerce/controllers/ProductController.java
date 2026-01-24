package org.amouri.ecommerce.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.ProductPurchasedRequest;
import org.amouri.ecommerce.DTOs.ProductPurchasedResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.ProductResponse;
import org.amouri.ecommerce.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping(name = "/create-product", consumes = "multipart/form-data")
    public ResponseEntity<Integer> createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(service.createProduct(request, files));
    }

    @PostMapping("/purchase")
    public ResponseEntity<Set<ProductPurchasedResponse>> purchaseProducts(
            @RequestBody @Valid Set<ProductPurchasedRequest> request
    ) {
        return ResponseEntity.ok(service.purchaseProducts(request));
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable(name = "product-id") Integer productId
    ) {
        return ResponseEntity.ok(service.findById(productId));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
