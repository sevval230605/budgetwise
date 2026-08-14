package com.budgetwise.budgetwise.controller;

import com.budgetwise.budgetwise.entity.Budget;
import com.budgetwise.budgetwise.service.BudgetService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/budgets")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(
            BudgetService budgetService
    ) {
        this.budgetService = budgetService;
    }

    // =========================
    // BÜTÇEYİ GETİR
    // =========================

    @GetMapping("/{userId}/{month}")
    public Budget getBudget(
            @PathVariable Long userId,
            @PathVariable String month,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {

        return budgetService.getBudget(
                userId,
                month,
                authenticatedUserId
        );
    }

    // =========================
    // BÜTÇE KAYDET
    // =========================

    @PostMapping("/{userId}")
    public Budget saveBudget(
            @PathVariable Long userId,
            @RequestParam String month,
            @RequestParam Double amount,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {

        return budgetService.saveBudget(
                userId,
                month,
                amount,
                authenticatedUserId
        );
    }
}