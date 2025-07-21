package com.mertyurekli.minibankingbackend.mapper;

import com.mertyurekli.minibankingbackend.dto.TransactionDto;
import com.mertyurekli.minibankingbackend.entity.Transaction;

import java.time.LocalDateTime;

public class TransactionMapper {

    public static TransactionDto mapToTransactionDto(Transaction transaction) {
        return new TransactionDto(
                transaction.getId(),
                transaction.getFrom().getId(),
                transaction.getTo().getId(),
                transaction.getFrom().getNumber(),
                transaction.getTo().getNumber(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getStatus()
        );
    }

    public static Transaction mapToTransaction(TransactionDto transactionDto) {
        return new Transaction(
                transactionDto.getId(),
                null, // from account will be set in service
                null, // to account will be set in service
                transactionDto.getAmount(),
                LocalDateTime.now(),
                transactionDto.getStatus()
        );
    }
} 