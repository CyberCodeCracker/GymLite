package org.amouri.ecommerce.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.*;
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

    @PostMapping(value = "/create-product", consumes = "multipart/form-data")
    public ResponseEntity<Integer> createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(service.createProduct(request, files));
    }

    @PostMapping(value = "/{product-id}/images", consumes = "multipart/form-data")
    public ResponseEntity<Void> addProductImages(
            @PathVariable(name = "product-id") Integer productId,
            @RequestPart("files") List<MultipartFile> files
    ) {
        service.addProductImages(productId, files);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<ProductPurchasedResponse>> purchaseProducts(
            @RequestBody @Valid List<ProductPurchasedRequest> request
    ) {
        return ResponseEntity.ok(service.purchaseProducts(request));
    }

    @PatchMapping("/{product-id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable(name = "product-id") Integer productId,
            @RequestBody @Valid UpdateProductRequest request
    ) {
        return ResponseEntity.ok(service.updateProduct(productId, request));
    }

    @PutMapping("/{product-id}/images/reorder")
    public ResponseEntity<Void> reorderProductImages(
            @PathVariable(name = "product-id") Integer productId,
            @RequestBody List<Integer> imageIds
    ) {
        service.reorderProductImages(productId, imageIds);
        return ResponseEntity.ok().build();
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

    @DeleteMapping("/{product-id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable(name = "product-id") Integer productId
    ) {
        service.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{product-id}/images/{image-id}")
    public ResponseEntity<Void> deleteProductImages(
            @PathVariable(name = "product-id") Integer productId,
            @PathVariable(name = "image-id") Integer imageId
    ) {
        service.deleteProductImage(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}
