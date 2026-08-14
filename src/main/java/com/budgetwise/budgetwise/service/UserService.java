package com.budgetwise.budgetwise.service;

import com.budgetwise.budgetwise.entity.User;
import com.budgetwise.budgetwise.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // KAYIT OL
    // =========================

    public User register(
            String email,
            String password
    ) {

        String cleanEmail =
                email.trim().toLowerCase();

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new RuntimeException(
                    "Bu e-posta zaten kayıtlı"
            );
        }

        User user = new User();

        user.setEmail(cleanEmail);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        return userRepository.save(user);
    }

    // =========================
    // GİRİŞ YAP
    // =========================

    public User login(
            String email,
            String password
    ) {

        String cleanEmail =
                email.trim().toLowerCase();

        User user = userRepository
                .findByEmail(cleanEmail)
                .orElse(null);

        if (user == null) {
            return null;
        }

        boolean passwordCorrect =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        if (!passwordCorrect) {
            return null;
        }

        return user;
    }

    // =========================
    // JWT TOKEN OLUŞTUR
    // =========================

    public String generateToken(User user) {

        return jwtService.generateToken(
                user.getId(),
                user.getEmail()
        );
    }
}