package com.mertyurekli.minibankingbackend.service.impl;

import com.mertyurekli.minibankingbackend.dto.AccountDto;
import com.mertyurekli.minibankingbackend.entity.Account;
import com.mertyurekli.minibankingbackend.entity.User;
import com.mertyurekli.minibankingbackend.exception.ResourceNotFoundException;
import com.mertyurekli.minibankingbackend.mapper.AccountMapper;
import com.mertyurekli.minibankingbackend.repository.AccountRepository;
import com.mertyurekli.minibankingbackend.repository.UserRepository;
import com.mertyurekli.minibankingbackend.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {

    private AccountRepository accountRepository;
    private UserRepository userRepository;

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Account account = AccountMapper.mapToAccount(accountDto);
        account.setUser(user);
        account.setCreatedAt(java.time.LocalDateTime.now());
        account.setUpdatedAt(java.time.LocalDateTime.now());
        
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<AccountDto> searchAccounts(String searchTerm) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<Account> accounts = accountRepository.findByUserAndNumberContainingOrUserAndNameContaining(user, searchTerm);
        return accounts.stream()
                .map(AccountMapper::mapToAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDto getAccountById(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    public AccountDto getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    public AccountDto updateAccount(UUID accountId, AccountDto accountDto) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Account existingAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        
        // Check if the account belongs to the current user
        if (!existingAccount.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Account not found or access denied");
        }
        
        Account updatedAccount = AccountMapper.mapToAccountForUpdate(accountDto, existingAccount);
        updatedAccount.setUpdatedAt(java.time.LocalDateTime.now());
        Account savedAccount = accountRepository.save(updatedAccount);
        
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public void deleteAccount(UUID accountId) {
        System.out.println("Delete account called with ID: " + accountId);
        
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.println("Current user: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        
        System.out.println("Found account: " + account.getId() + " for user: " + account.getUser().getId());
        
        // Check if the account belongs to the current user
        if (!account.getUser().getId().equals(user.getId())) {
            System.out.println("Access denied: account user ID " + account.getUser().getId() + " != current user ID " + user.getId());
            throw new ResourceNotFoundException("Account not found or access denied");
        }
        
        System.out.println("Deleting account: " + accountId);
        accountRepository.delete(account);
        System.out.println("Account deleted successfully: " + accountId);
    }
} 