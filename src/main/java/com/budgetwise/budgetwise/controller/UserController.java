package com.budgetwise.budgetwise.controller;

import com.budgetwise.budgetwise.entity.User;
import com.budgetwise.budgetwise.repository.UserRepository;
import com.budgetwise.budgetwise.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(
            UserService userService,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // =========================
    // KAYIT OL
    // =========================

    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request
    ) {

        return userService.register(
                request.getEmail(),
                request.getPassword()
        );
    }


    // =========================
    // GİRİŞ YAP
    // =========================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {

            return new LoginResponse(
                    false,
                    null,
                    null,
                    "E-posta veya şifre hatalı"
            );
        }

        return new LoginResponse(
                true,
                user.getId(),
                user.getEmail(),
                "Giriş başarılı"
        );
    }


    // =========================
    // KULLANICI BİLGİLERİNİ GETİR
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id
    ) {

        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(
                        new UserResponse(
                                user.getId(),
                                user.getEmail()
                        )
                ))
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // =========================
    // REGISTER REQUEST
    // =========================

    public static class RegisterRequest {

        private String email;
        private String password;

        public RegisterRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


    // =========================
    // LOGIN REQUEST
    // =========================

    public static class LoginRequest {

        private String email;
        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


    // =========================
    // LOGIN RESPONSE
    // =========================

    public static class LoginResponse {

        private boolean success;
        private Long userId;
        private String email;
        private String message;

        public LoginResponse(
                boolean success,
                Long userId,
                String email,
                String message
        ) {

            this.success = success;
            this.userId = userId;
            this.email = email;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public Long getUserId() {
            return userId;
        }

        public String getEmail() {
            return email;
        }

        public String getMessage() {
            return message;
        }
    }


    // =========================
    // USER RESPONSE
    // =========================

    public static class UserResponse {

        private Long id;
        private String email;

        public UserResponse(
                Long id,
                String email
        ) {

            this.id = id;
            this.email = email;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }
    }
}