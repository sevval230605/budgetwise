package com.budgetwise.budgetwise.service;

import com.budgetwise.budgetwise.entity.Expense;
import com.budgetwise.budgetwise.entity.User;
import com.budgetwise.budgetwise.repository.ExpenseRepository;
import com.budgetwise.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // KULLANICIYA AİT GİDERLERİ GETİR
    // =========================

    public List<Expense> getUserExpenses(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kullanıcı bulunamadı"
                        )
                );

        return expenseRepository.findByUser(user);
    }

    // =========================
    // YENİ GİDER KAYDET
    // =========================

    public Expense saveExpense(
            Expense expense,
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kullanıcı bulunamadı"
                        )
                );

        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    // =========================
    // GİDER GÜNCELLE
    // =========================

    public Expense updateExpense(
            Long id,
            Expense expense
    ) {

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gider bulunamadı"
                                )
                        );

        User existingUser =
                existingExpense.getUser();

        if (existingUser == null) {
            throw new RuntimeException(
                    "Giderin kullanıcısı bulunamadı"
            );
        }

        existingExpense.setTitle(
                expense.getTitle()
        );

        existingExpense.setAmount(
                expense.getAmount()
        );

        existingExpense.setCategory(
                expense.getCategory()
        );

        existingExpense.setDate(
                expense.getDate()
        );

        // Mevcut kullanıcı bağlantısını koru
        existingExpense.setUser(existingUser);

        return expenseRepository.save(
                existingExpense
        );
    }

    // =========================
    // GİDER SİL
    // =========================

    public void deleteExpense(Long id) {

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gider bulunamadı"
                                )
                        );

        if (existingExpense.getUser() == null) {
            throw new RuntimeException(
                    "Giderin kullanıcısı bulunamadı"
            );
        }

        expenseRepository.delete(
                existingExpense
        );
    }
}