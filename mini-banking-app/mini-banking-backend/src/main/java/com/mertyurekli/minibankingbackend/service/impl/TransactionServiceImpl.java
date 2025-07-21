package com.mertyurekli.minibankingbackend.service.impl;

import com.mertyurekli.minibankingbackend.dto.TransactionDto;
import com.mertyurekli.minibankingbackend.dto.TransferRequestDto;
import com.mertyurekli.minibankingbackend.entity.Account;
import com.mertyurekli.minibankingbackend.entity.Transaction;
import com.mertyurekli.minibankingbackend.exception.ResourceNotFoundException;
import com.mertyurekli.minibankingbackend.mapper.TransactionMapper;
import com.mertyurekli.minibankingbackend.repository.AccountRepository;
import com.mertyurekli.minibankingbackend.repository.TransactionRepository;
import com.mertyurekli.minibankingbackend.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;
    private AccountRepository accountRepository;

    @Override
    public void transferMoney(TransferRequestDto dto) {
        // Gönderen ve alıcı hesapları bul
        Account fromAccount = accountRepository.findByAccountNumber(dto.getFromAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found"));
        Account toAccount = accountRepository.findByAccountNumber(dto.getToAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found"));

        java.math.BigDecimal amount = java.math.BigDecimal.valueOf(dto.getAmount());

        // Bakiyeyi kontrol et
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Bakiyeleri güncelle
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Transaction kaydı oluştur (giden)
        Transaction outTx = new Transaction();
        outTx.setFrom(fromAccount);
        outTx.setTo(toAccount);
        outTx.setAmount(amount.negate());
        outTx.setTransactionDate(java.time.LocalDateTime.now());
        outTx.setStatus("SUCCESS");
        assert outTx.getFrom() != null : "outTx.from null";
        assert outTx.getTo() != null : "outTx.to null";
        assert outTx.getAmount() != null : "outTx.amount null";
        assert outTx.getTransactionDate() != null : "outTx.transactionDate null";
        assert outTx.getStatus() != null : "outTx.status null";
        System.out.println("DEBUG: Saving outTx: " + outTx);
        transactionRepository.save(outTx);

        // Transaction kaydı oluştur (gelen)
        Transaction inTx = new Transaction();
        inTx.setFrom(fromAccount);
        inTx.setTo(toAccount);
        inTx.setAmount(amount);
        inTx.setTransactionDate(java.time.LocalDateTime.now());
        inTx.setStatus("SUCCESS");
        assert inTx.getFrom() != null : "inTx.from null";
        assert inTx.getTo() != null : "inTx.to null";
        assert inTx.getAmount() != null : "inTx.amount null";
        assert inTx.getTransactionDate() != null : "inTx.transactionDate null";
        assert inTx.getStatus() != null : "inTx.status null";
        System.out.println("DEBUG: Saving inTx: " + inTx);
        transactionRepository.save(inTx);
    }

    @Override
    public List<TransactionDto> getTransactionHistory(UUID accountId) {
        List<Transaction> transactions = transactionRepository.findByFromIdOrToIdOrderByTransactionDateDesc(accountId, accountId);
        return transactions.stream()
                .map(TransactionMapper::mapToTransactionDto)
                .collect(Collectors.toList());
    }
} 