package org.amouri.ecommerce.DTOs;

public record ProductImageResponse(
        Integer id,
        String imageUrl,
        Integer displayOrder
) {
}