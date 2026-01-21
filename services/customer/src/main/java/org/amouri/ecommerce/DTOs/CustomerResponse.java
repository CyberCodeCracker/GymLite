package org.amouri.ecommerce.DTOs;

import org.amouri.ecommerce.entities.Address;

public record CustomerResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        Address address
) {
}
