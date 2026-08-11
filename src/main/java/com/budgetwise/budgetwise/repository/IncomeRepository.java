package com.budgetwise.budgetwise.repository;

import com.budgetwise.budgetwise.entity.Income;
import com.budgetwise.budgetwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);

}