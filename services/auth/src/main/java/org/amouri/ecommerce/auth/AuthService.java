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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("User with email " + request.getEmail() + " already exists");
        }

        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(List.of("CUSTOMER"))
                .accountEnabled(true)
                .accountLocked(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ROLE_CUSTOMER");
        claims.put("fullName", user.getFullName());
        claims.put("userId", user.getId());

        String accessToken = jwtService.generateAccessToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = (User) auth.getPrincipal();

        Map<String, Object> claims = new HashMap<>();
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> "ROLE_" + r.toUpperCase())
                .orElse("ROLE_CUSTOMER");
        claims.put("role", role);
        claims.put("fullName", user.getFullName());
        claims.put("userId", user.getId());

        String accessToken = jwtService.generateAccessToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
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

        User user = (User) userDetails;
        Map<String, Object> claims = new HashMap<>();
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> "ROLE_" + r.toUpperCase())
                .orElse("ROLE_CUSTOMER");
        claims.put("role", role);
        claims.put("fullName", user.getFullName());
        claims.put("userId", user.getId());

        String newAccessToken = jwtService.generateAccessToken(claims, user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
