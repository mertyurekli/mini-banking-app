package com.mertyurekli.minibankingbackend.controller;

import com.mertyurekli.minibankingbackend.dto.TransactionDto;
import com.mertyurekli.minibankingbackend.dto.TransferRequestDto;
import com.mertyurekli.minibankingbackend.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transaction Management", description = "APIs for money transfers and transaction history")
public class TransactionController {

    private TransactionService transactionService;

    @Operation(summary = "Initiate money transfer", description = "Transfers money from one account to another")
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequestDto dto) {
        transactionService.transferMoney(dto);
        return ResponseEntity.ok("Transfer successful");
    }

    @Operation(summary = "View transaction history", description = "Retrieves the transaction history for a specified account")
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDto>> getTransactionHistory(@PathVariable("accountId") UUID accountId) {
        List<TransactionDto> transactions = transactionService.getTransactionHistory(accountId);
        return ResponseEntity.ok(transactions);
    }
} 