package com.mertyurekli.minibankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDto {
    private String fromAccountNumber;
    private String toAccountNumber;
    private double amount;
} 