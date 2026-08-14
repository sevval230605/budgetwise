package com.budgetwise.budgetwise.service;

import com.budgetwise.budgetwise.entity.Income;
import com.budgetwise.budgetwise.entity.User;
import com.budgetwise.budgetwise.repository.IncomeRepository;
import com.budgetwise.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeService(
            IncomeRepository incomeRepository,
            UserRepository userRepository
    ) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GELİRLERİ GETİR
    // =========================

    public List<Income> getUserIncomes(
            Long userId,
            Long authenticatedUserId
    ) {

        checkAuthorization(userId, authenticatedUserId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı"));

        return incomeRepository.findByUser(user);
    }

    // =========================
    // GELİR EKLE
    // =========================

    public Income saveIncome(
            Income income,
            Long userId,
            Long authenticatedUserId
    ) {

        checkAuthorization(userId, authenticatedUserId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı"));

        income.setUser(user);

        return incomeRepository.save(income);
    }

    // =========================
    // GELİR GÜNCELLE
    // =========================

    public Income updateIncome(
            Long id,
            Income income,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        Income existingIncome =
                incomeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gelir bulunamadı"
                                ));

        User existingUser = existingIncome.getUser();

        if (existingUser == null) {
            throw new RuntimeException(
                    "Gelirin kullanıcısı bulunamadı"
            );
        }

        if (!existingUser.getId().equals(authenticatedUserId)) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        existingIncome.setTitle(income.getTitle());
        existingIncome.setAmount(income.getAmount());
        existingIncome.setDate(income.getDate());

        // Kullanıcıyı değiştirmiyoruz
        existingIncome.setUser(existingUser);

        return incomeRepository.save(existingIncome);
    }

    // =========================
    // GELİR SİL
    // =========================

    public void deleteIncome(
            Long id,
            Long authenticatedUserId
    ) {

        if (authenticatedUserId == null) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        Income existingIncome =
                incomeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gelir bulunamadı"
                                ));

        User existingUser = existingIncome.getUser();

        if (existingUser == null) {
            throw new RuntimeException(
                    "Gelirin kullanıcısı bulunamadı"
            );
        }

        if (!existingUser.getId().equals(authenticatedUserId)) {
            throw new RuntimeException("Yetkisiz erişim");
        }

        incomeRepository.delete(existingIncome);
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