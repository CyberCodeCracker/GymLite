package org.amouri.ecommerce.DTOs;

import java.util.List;

public record CategoryResponse(
        String name,
        String description,
        List<ProductResponse> products
) {
}
