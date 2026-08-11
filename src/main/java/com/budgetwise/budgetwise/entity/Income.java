package com.budgetwise.budgetwise.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Gelir başlığı boş bırakılamaz")
    private String title;

    @NotNull(message = "Tutar boş bırakılamaz")
    @Positive(message = "Tutar 0'dan büyük olmalıdır")
    private Double amount;

    @NotNull(message = "Tarih boş bırakılamaz")
    private LocalDate date;

    // Gelirin hangi kullanıcıya ait olduğunu tutar
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Income() {
    }

    public Income(
            Long id,
            String title,
            Double amount,
            LocalDate date,
            User user
    ) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}