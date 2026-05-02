package org.amouri.ecommerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity serverHttpSecurity) {
        serverHttpSecurity
                .cors(cors -> cors.configurationSource(corsSource()))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/eureka/**").permitAll()
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/product/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/category/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/order").hasAuthority("SCOPE_ROLE_CUSTOMER")
                        .pathMatchers(HttpMethod.POST, "/api/payment").hasAuthority("SCOPE_ROLE_CUSTOMER")
                        .pathMatchers(HttpMethod.PATCH, "/api/order/*/status").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/product/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/product/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/product/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/category/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/category/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/category/**").hasAuthority("SCOPE_ROLE_ADMIN")
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return serverHttpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
