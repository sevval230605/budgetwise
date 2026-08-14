package com.budgetwise.budgetwise.controller;

import com.budgetwise.budgetwise.entity.Income;
import com.budgetwise.budgetwise.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incomes")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping("/user/{userId}")
    public List<Income> getUserIncomes(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return incomeService.getUserIncomes(
                userId,
                authenticatedUserId
        );
    }

    @PostMapping("/user/{userId}")
    public Income addIncome(
            @PathVariable Long userId,
            @Valid @RequestBody Income income,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return incomeService.saveIncome(
                income,
                userId,
                authenticatedUserId
        );
    }

    @PutMapping("/{id}")
    public Income updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody Income income,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return incomeService.updateIncome(
                id,
                income,
                authenticatedUserId
        );
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(
            @PathVariable Long id,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        incomeService.deleteIncome(
                id,
                authenticatedUserId
        );
    }
}