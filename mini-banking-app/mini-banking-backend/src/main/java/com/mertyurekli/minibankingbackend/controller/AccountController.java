package com.mertyurekli.minibankingbackend.controller;

import com.mertyurekli.minibankingbackend.dto.AccountDto;
import com.mertyurekli.minibankingbackend.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

@AllArgsConstructor
@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Account Management", description = "APIs for account operations")
public class AccountController {

    private static final Logger logger = Logger.getLogger(AccountController.class.getName());
    private AccountService accountService;

    @Operation(summary = "Create account", description = "Creates a new account for the authenticated user")
    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto accountDto) {
        AccountDto savedAccount = accountService.createAccount(accountDto);
        return new ResponseEntity<>(savedAccount, HttpStatus.CREATED);
    }

    @Operation(summary = "Search accounts", description = "Search accounts for the authenticated user")
    @PostMapping("/search")
    public ResponseEntity<List<AccountDto>> searchAccounts(@RequestParam String searchTerm) {
        List<AccountDto> accounts = accountService.searchAccounts(searchTerm);
        return ResponseEntity.ok(accounts);
    }

    @Operation(summary = "Get account by number", description = "Retrieves account details by account number")
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<AccountDto> getAccountByNumber(@PathVariable("accountNumber") String accountNumber) {
        AccountDto accountDto = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(accountDto);
    }

    @Operation(summary = "Get account by ID", description = "Retrieves details of a specific account")
    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable("id") UUID accountId) {
        AccountDto accountDto = accountService.getAccountById(accountId);
        return ResponseEntity.ok(accountDto);
    }

    @Operation(summary = "Update account", description = "Updates the selected account for the authenticated user")
    @PutMapping("/{id}")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable("id") UUID accountId, @RequestBody AccountDto accountDto) {
        AccountDto updatedAccount = accountService.updateAccount(accountId, accountDto);
        return ResponseEntity.ok(updatedAccount);
    }

    @Operation(summary = "Delete account", description = "Deletes the selected account for the authenticated user")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable("id") String accountId) {
        logger.info("Delete endpoint called with accountId: " + accountId);
        logger.info("AccountId type: " + accountId.getClass().getSimpleName());
        
        try {
            logger.info("Attempting to parse UUID from: " + accountId);
            UUID uuid = UUID.fromString(accountId);
            logger.info("Successfully parsed UUID: " + uuid);
            
            logger.info("Calling accountService.deleteAccount with UUID: " + uuid);
            accountService.deleteAccount(uuid);
            logger.info("Account deleted successfully");
            
            return ResponseEntity.ok("Account deleted successfully");
        } catch (IllegalArgumentException e) {
            logger.severe("Invalid UUID format: " + accountId + ", Error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid account ID format: " + e.getMessage());
        } catch (Exception e) {
            logger.severe("Unexpected error during account deletion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
} 