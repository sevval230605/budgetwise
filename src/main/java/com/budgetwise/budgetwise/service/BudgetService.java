package com.budgetwise.budgetwise.service;

import com.budgetwise.budgetwise.entity.Budget;
import com.budgetwise.budgetwise.entity.User;
import com.budgetwise.budgetwise.repository.BudgetRepository;
import com.budgetwise.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // BÜTÇEYİ GETİR
    // =========================

    public Budget getBudget(
            Long userId,
            String month,
            Long authenticatedUserId
    ) {

        checkAuthorization(
                userId,
                authenticatedUserId
        );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kullanıcı bulunamadı"
                        )
                );

        return budgetRepository
                .findByUserAndMonth(user, month)
                .orElse(null);
    }

    // =========================
    // BÜTÇE KAYDET
    // =========================

    public Budget saveBudget(
            Long userId,
            String month,
            Double amount,
            Long authenticatedUserId
    ) {

        checkAuthorization(
                userId,
                authenticatedUserId
        );

        if (month == null || month.isBlank()) {
            throw new RuntimeException(
                    "Bütçe ayı boş olamaz"
            );
        }

        if (amount == null || amount < 0) {
            throw new RuntimeException(
                    "Bütçe miktarı geçersiz"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kullanıcı bulunamadı"
                        )
                );

        Budget budget = budgetRepository
                .findByUserAndMonth(user, month)
                .orElse(new Budget());

        budget.setUser(user);
        budget.setMonth(month);
        budget.setAmount(amount);

        return budgetRepository.save(budget);
    }

    // =========================
    // YETKİ KONTROLÜ
    // =========================

    private void checkAuthorization(
            Long userId,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException(
                    "Yetkisiz erişim"
            );
        }

        if (userId == null) {
            throw new RuntimeException(
                    "Kullanıcı ID bulunamadı"
            );
        }

        if (!userId.equals(authenticatedUserId)) {
            throw new RuntimeException(
                    "Yetkisiz erişim"
            );
        }
    }
}