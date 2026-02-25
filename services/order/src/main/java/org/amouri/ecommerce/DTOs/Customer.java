package org.amouri.ecommerce.DTOs;

public record Customer(
        String id,
        String firstName,
        String lastName,
        String email
) {
}
