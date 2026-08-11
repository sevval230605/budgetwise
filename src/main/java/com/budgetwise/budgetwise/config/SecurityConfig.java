package com.budgetwise.budgetwise.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // CORS
                .cors(Customizer.withDefaults())

                // Şimdilik CSRF kapalı
                .csrf(csrf -> csrf.disable())

                // Şimdilik mevcut frontend bağlantılarını
                // bozmamak için endpoint'ler açık
                .authorizeHttpRequests(auth -> auth

                        // Kullanıcı işlemleri
                        .requestMatchers("/users/**")
                        .permitAll()

                        // Gelir işlemleri
                        .requestMatchers("/incomes/**")
                        .permitAll()

                        // Gider işlemleri
                        .requestMatchers("/expenses/**")
                        .permitAll()

                        // H2 Database Console
                        .requestMatchers("/h2-console/**")
                        .permitAll()

                        // Swagger
                        .requestMatchers("/swagger-ui/**")
                        .permitAll()

                        .requestMatchers("/v3/api-docs/**")
                        .permitAll()

                        // Diğer istekler
                        .anyRequest()
                        .permitAll()
                )

                // H2 Console için iframe kullanımına izin ver
                .headers(headers ->
                        headers.frameOptions(frame ->
                                frame.disable()
                        )
                );

        return http.build();
    }

    // =========================
    // CORS AYARLARI
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:5175"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================
    // ŞİFRE ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}