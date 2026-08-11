package com.budgetwise.budgetwise.mapper;

import com.budgetwise.budgetwise.dto.ExpenseDTO;
import com.budgetwise.budgetwise.entity.Expense;

public class ExpenseMapper {

    public static ExpenseDTO toDTO(Expense expense) {
        return new ExpenseDTO(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory()
        );
    }

    public static Expense toEntity(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();

        expense.setId(expenseDTO.getId());
        expense.setTitle(expenseDTO.getTitle());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());

        return expense;
    }
}