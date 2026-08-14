package com.budgetwise.budgetwise.repository;

import com.budgetwise.budgetwise.entity.Budget;
import com.budgetwise.budgetwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserAndMonth(
            User user,
            String month
    );
}
