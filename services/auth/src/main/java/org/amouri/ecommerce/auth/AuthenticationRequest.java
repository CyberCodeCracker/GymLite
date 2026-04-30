package org.amouri.ecommerce.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationRequest(
        @NotBlank(message = "Email cannot be blank") @Email(message = "Invalid email format") String email,
        @NotBlank(message = "Password cannot be blank") @Size(min = 8, max = 20) String password
) {}
