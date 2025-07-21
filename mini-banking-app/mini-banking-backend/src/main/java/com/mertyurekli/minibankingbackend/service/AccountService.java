package com.mertyurekli.minibankingbackend.service;

import com.mertyurekli.minibankingbackend.dto.AccountDto;

import java.util.List;
import java.util.UUID;

public interface AccountService {
    AccountDto createAccount(AccountDto accountDto);
    
    List<AccountDto> searchAccounts(String searchTerm);
    
    AccountDto getAccountById(UUID accountId);
    
    AccountDto getAccountByNumber(String accountNumber);
    
    AccountDto updateAccount(UUID accountId, AccountDto accountDto);
    
    void deleteAccount(UUID accountId);
} 