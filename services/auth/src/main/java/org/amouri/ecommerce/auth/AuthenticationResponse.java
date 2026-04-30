package org.amouri.ecommerce.auth;

public record AuthenticationResponse(
        String accessToken,
        String refreshToken
) {}
