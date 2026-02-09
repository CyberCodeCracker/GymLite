package org.amouri.ecommerce.DTOs;

public record Customer(
        Integer id,
        String firstName,
        String lastName,
        String email
) {
}
