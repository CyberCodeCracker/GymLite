package org.amouri.ecommerce.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "First name cannot be blank") String firstName,
        @NotBlank(message = "Last name cannot be blank") String lastName,
        @NotBlank(message = "Email cannot be blank") @Email(message = "Invalid email format") String email,
        @NotBlank(message = "Password cannot be blank") @Size(min = 8, max = 20) String password,
        @NotBlank(message = "Password confirmation cannot be blank") String passwordConfirm
) {}
