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
    // GİDERLERİ GETİR
    // =========================

    public List<Expense> getUserExpenses(
            Long userId,
            Long authenticatedUserId
    ) {

        checkAuthorization(userId, authenticatedUserId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı"));

        return expenseRepository.findByUser(user);
    }

    // =========================
    // GİDER EKLE
    // =========================

    public Expense saveExpense(
            Expense expense,
            Long userId,
            Long authenticatedUserId
    ) {

        checkAuthorization(userId, authenticatedUserId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı"));

        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    // =========================
    // GİDER GÜNCELLE
    // =========================

    public Expense updateExpense(
            Long id,
            Expense expense,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gider bulunamadı"
                                ));

        User existingUser = existingExpense.getUser();

        if (existingUser == null) {
            throw new RuntimeException(
                    "Giderin kullanıcısı bulunamadı"
            );
        }

        if (!existingUser.getId().equals(authenticatedUserId)) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        existingExpense.setTitle(expense.getTitle());
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setCategory(expense.getCategory());
        existingExpense.setDate(expense.getDate());

        // Giderin sahibini değiştirmiyoruz
        existingExpense.setUser(existingUser);

        return expenseRepository.save(existingExpense);
    }

    // =========================
    // GİDER SİL
    // =========================

    public void deleteExpense(
            Long id,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        Expense existingExpense =
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gider bulunamadı"
                                ));

        User existingUser = existingExpense.getUser();

        if (existingUser == null) {
            throw new RuntimeException(
                    "Giderin kullanıcısı bulunamadı"
            );
        }

        if (!existingUser.getId().equals(authenticatedUserId)) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        expenseRepository.delete(existingExpense);
    }

    // =========================
    // YETKİ KONTROLÜ
    // =========================

    private void checkAuthorization(
            Long userId,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        if (userId == null) {
            throw new RuntimeException("Kullanıcı ID bulunamadı");
        }

        if (!userId.equals(authenticatedUserId)) {
            throw new RuntimeException("Yetkisiz erişim");
        }
    }
}