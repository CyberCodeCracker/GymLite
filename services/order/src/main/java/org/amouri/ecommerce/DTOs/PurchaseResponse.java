package org.amouri.ecommerce.DTOs;

import java.math.BigDecimal;

public record PurchaseResponse(
         Integer id,
         String name,
         String description,
         BigDecimal price,
         double availableQuantity
) {
}
