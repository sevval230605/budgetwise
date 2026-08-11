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
    // KULLANICIYA AİT GELİRLERİ GETİR
    // =========================

    public List<Income> getUserIncomes(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı"));

        return incomeRepository.findByUser(user);
    }

    // =========================
    // YENİ GELİR KAYDET
    // =========================

    public Income saveIncome(
            Income income,
            Long userId
    ) {

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
            Income income
    ) {

        Income existingIncome =
                incomeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gelir bulunamadı"
                                ));

        // Mevcut gelirin kullanıcısı
        User existingUser =
                existingIncome.getUser();

        // Güncellenecek gelire başka
        // bir kullanıcının bağlanmasını engelle
        if (existingUser == null) {
            throw new RuntimeException(
                    "Gelirin kullanıcısı bulunamadı"
            );
        }

        existingIncome.setTitle(
                income.getTitle()
        );

        existingIncome.setAmount(
                income.getAmount()
        );

        existingIncome.setDate(
                income.getDate()
        );

        // Kullanıcı bilgisini değiştirme
        existingIncome.setUser(existingUser);

        return incomeRepository.save(
                existingIncome
        );
    }

    // =========================
    // GELİR SİL
    // =========================

    public void deleteIncome(Long id) {

        Income existingIncome =
                incomeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gelir bulunamadı"
                                ));

        // Kullanıcısı olmayan gelir silinmesin
        if (existingIncome.getUser() == null) {
            throw new RuntimeException(
                    "Gelirin kullanıcısı bulunamadı"
            );
        }

        incomeRepository.delete(
                existingIncome
        );
    }
}