package org.amouri.ecommerce.DTOs;

public record UpdateCategoryRequest(
        String name,
        String description
) {
}
