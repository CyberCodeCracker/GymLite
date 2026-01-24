package org.amouri.ecommerce.DTOs;

import java.math.BigDecimal;

public record ProductPurchasedResponse(
        Integer id,
        String name,
        String description,
        BigDecimal price,
        double availableQuantity
) {
}
