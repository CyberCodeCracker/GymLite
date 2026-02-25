package org.amouri.ecommerce.DTOs;

public record CustomerPaymentRequest(
        String firstName,
        String lastName,
        String email
) {}