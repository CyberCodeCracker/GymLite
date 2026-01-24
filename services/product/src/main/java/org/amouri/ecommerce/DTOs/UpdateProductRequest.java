package org.amouri.ecommerce.DTOs;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateProductRequest(
        String name,
        String description,
        @Positive(message = "Available quantity must be positive")
        Double availableQuantity,
        @Positive(message = "Price must be positive")
        BigDecimal price,
        Integer categoryId
) {
}