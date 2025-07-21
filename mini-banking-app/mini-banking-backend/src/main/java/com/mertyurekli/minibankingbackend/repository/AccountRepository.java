package com.mertyurekli.minibankingbackend.repository;

import com.mertyurekli.minibankingbackend.entity.Account;
import com.mertyurekli.minibankingbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    
    @Query("SELECT a FROM Account a WHERE a.user = :user AND (a.number LIKE %:searchTerm% OR a.name LIKE %:searchTerm%)")
    List<Account> findByUserAndNumberContainingOrUserAndNameContaining(@Param("user") User user, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT a FROM Account a WHERE a.number = :accountNumber")
    java.util.Optional<Account> findByNumber(@Param("accountNumber") String accountNumber);
    
    @Query("SELECT a FROM Account a WHERE a.user = :user")
    List<Account> findByUser(@Param("user") User user);

    @Query("SELECT a FROM Account a WHERE a.number = :accountNumber")
    java.util.Optional<Account> findByAccountNumber(String accountNumber);
} 