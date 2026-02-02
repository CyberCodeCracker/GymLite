package org.amouri.ecommerce.DTOs;

public record CustomerResponse(
        Integer id,
        String firstName,
        String lastName,
        String email
) {
}
