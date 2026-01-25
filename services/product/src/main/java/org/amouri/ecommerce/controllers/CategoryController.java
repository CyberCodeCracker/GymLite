package org.amouri.ecommerce.controllers;

import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.CategoryRequest;
import org.amouri.ecommerce.DTOs.CategoryResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.UpdateCategoryRequest;
import org.amouri.ecommerce.services.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping("/create-category")
    public ResponseEntity<Integer> createCategory(
            @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(service.createCategory(request));
    }

    @PostMapping("/{category-id}/add-product")
    public ResponseEntity<Void> addProduct(
            @RequestBody ProductRequest request,
            @PathVariable(value = "category-id") Integer categoryId
    ) {
        service.addProduct(request, categoryId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{category-id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @RequestBody UpdateCategoryRequest request,
            @PathVariable(name = "category-id") Integer categoryId
    ) {
        return ResponseEntity.ok(service.updateCategory(request, categoryId));
    }

    @GetMapping()
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("{category-id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable(value = "category-id") Integer categoryId
    ) {
        return ResponseEntity.ok(service.getCategoryById(categoryId));
    }

    @DeleteMapping("{category-id}")
    public ResponseEntity<Void> deleteCategoryById(
            @PathVariable(value = "category-id") Integer categoryId
    ) {
        service.deleteCategoryById(categoryId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/categories/{category-id}/products/{product-id}")
    public ResponseEntity<Void> deleteProductFromCategory(
            @PathVariable("category-id") Integer categoryId,
            @PathVariable("product-id") Integer productId
    ) {
        service.deleteProductFromCategory(categoryId, productId);
        return ResponseEntity.noContent().build();
    }

    // Delete multiple products from a category
    @DeleteMapping("/categories/{category-id}/products")
    public ResponseEntity<Void> deleteProductsFromCategory(
            @PathVariable("category-id") Integer categoryId,
            @RequestBody List<Integer> productIds
    ) {
        service.deleteProductsFromCategory(categoryId, productIds);
        return ResponseEntity.noContent().build();
    }}
