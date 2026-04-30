package org.amouri.ecommerce.DTOs;

import java.util.List;

public record CategoryResponse(
        Integer id,
        String name,
        String description,
        List<ProductResponse> products
) {
}
