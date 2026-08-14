package com.budgetwise.budgetwise.controller;

import com.budgetwise.budgetwise.entity.Expense;
import com.budgetwise.budgetwise.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getUserExpenses(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return expenseService.getUserExpenses(
                userId,
                authenticatedUserId
        );
    }

    @PostMapping("/user/{userId}")
    public Expense addExpense(
            @PathVariable Long userId,
            @Valid @RequestBody Expense expense,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return expenseService.saveExpense(
                expense,
                userId,
                authenticatedUserId
        );
    }

    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        return expenseService.updateExpense(
                id,
                expense,
                authenticatedUserId
        );
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal Long authenticatedUserId
    ) {
        expenseService.deleteExpense(
                id,
                authenticatedUserId
        );
    }
}