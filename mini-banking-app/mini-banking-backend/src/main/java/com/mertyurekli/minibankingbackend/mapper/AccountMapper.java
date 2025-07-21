package com.mertyurekli.minibankingbackend.mapper;

import com.mertyurekli.minibankingbackend.dto.AccountDto;
import com.mertyurekli.minibankingbackend.entity.Account;

import java.time.LocalDateTime;

public class AccountMapper {

    public static AccountDto mapToAccountDto(Account account) {
        return new AccountDto(
                account.getId(),
                account.getNumber(),
                account.getName(),
                account.getBalance(),
                account.getType(),
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }

    public static Account mapToAccount(AccountDto accountDto) {
        LocalDateTime now = LocalDateTime.now();
        Account account = new Account();
        // Don't set ID for new accounts - let JPA generate it
        // Generate account number if not provided
        if (accountDto.getNumber() == null || accountDto.getNumber().isEmpty()) {
            account.setNumber(generateAccountNumber());
        } else {
            account.setNumber(accountDto.getNumber());
        }
        account.setName(accountDto.getName());
        account.setBalance(accountDto.getBalance());
        account.setType(accountDto.getType());
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        // user will be set in service
        return account;
    }
    
    private static String generateAccountNumber() {
        // Generate a unique 10-digit account number using timestamp and random
        long timestamp = System.currentTimeMillis();
        int random = (int)(Math.random() * 10000);
        return String.format("%010d", (timestamp % 10000000000L) + random);
    }
    
    public static Account mapToAccountForUpdate(AccountDto accountDto, Account existingAccount) {
        existingAccount.setNumber(accountDto.getNumber());
        existingAccount.setName(accountDto.getName());
        existingAccount.setBalance(accountDto.getBalance());
        existingAccount.setType(accountDto.getType());
        existingAccount.setUpdatedAt(LocalDateTime.now());
        return existingAccount;
    }
} 