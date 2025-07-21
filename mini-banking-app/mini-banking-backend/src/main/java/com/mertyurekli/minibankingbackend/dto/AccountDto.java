package com.mertyurekli.minibankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.mertyurekli.minibankingbackend.entity.AccountType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    private UUID id;
    private String number;
    private String name;
    private BigDecimal balance;
    private AccountType type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 