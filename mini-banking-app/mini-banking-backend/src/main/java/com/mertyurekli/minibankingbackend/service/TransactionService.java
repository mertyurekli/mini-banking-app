package com.mertyurekli.minibankingbackend.service;

import com.mertyurekli.minibankingbackend.dto.TransactionDto;
import com.mertyurekli.minibankingbackend.dto.TransferRequestDto;

import java.util.List;
import java.util.UUID;

public interface TransactionService {
    void transferMoney(TransferRequestDto transferRequestDto);
    
    List<TransactionDto> getTransactionHistory(UUID accountId);
} 