package org.amouri.ecommerce.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.amouri.ecommerce.entities.Address;

public record CustomerRequest(
        String id,
        @NotNull(message = "First name can't be empty")
        String firstName,
        @NotNull(message = "Last name can't be empty")
        String lastName,
        @NotNull(message = "Email can't be empty")
        @Email(message = "Email is not a valid email address")
        String email,
        Address address
) {
}
