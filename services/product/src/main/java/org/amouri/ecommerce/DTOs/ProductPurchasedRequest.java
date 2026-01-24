package org.amouri.ecommerce.DTOs;

import jakarta.validation.constraints.NotNull;

public record ProductPurchasedRequest(
        @NotNull(message = "Product is required")
        Integer id,
        @NotNull(message = "Quantity is required")
        double availableQuantity
) {
}
