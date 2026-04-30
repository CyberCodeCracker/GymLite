package org.amouri.ecommerce.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.amouri.ecommerce.security.JwtService;
import org.amouri.ecommerce.user.User;
import org.amouri.ecommerce.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("User with email " + request.email() + " already exists");
        }
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(List.of("CUSTOMER"))
                .accountEnabled(true)
                .accountLocked(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        return buildResponse((User) auth.getPrincipal());
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is missing");
        }
        String userEmail = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new SecurityException("Invalid refresh token");
        }
        return buildResponse((User) userDetails);
    }

    private AuthenticationResponse buildResponse(User user) {
        Map<String, Object> claims = new HashMap<>();
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> "ROLE_" + r.toUpperCase())
                .orElse("ROLE_CUSTOMER");
        claims.put("role", role);
        claims.put("fullName", user.getFullName());
        claims.put("userId", user.getId().toString());

        return new AuthenticationResponse(
                jwtService.generateAccessToken(claims, user),
                jwtService.generateRefreshToken(user)
        );
    }
}
