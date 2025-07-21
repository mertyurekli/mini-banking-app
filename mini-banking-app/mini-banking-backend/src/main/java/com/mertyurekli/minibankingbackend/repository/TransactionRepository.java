package com.mertyurekli.minibankingbackend.repository;

import com.mertyurekli.minibankingbackend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByFromIdOrToIdOrderByTransactionDateDesc(UUID fromAccountId, UUID toAccountId);
} 