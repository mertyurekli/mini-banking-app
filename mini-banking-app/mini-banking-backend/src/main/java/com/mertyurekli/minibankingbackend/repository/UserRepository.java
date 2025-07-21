package com.mertyurekli.minibankingbackend.repository;

import java.util.Optional;
import java.util.UUID;
import com.mertyurekli.minibankingbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID>{
    
    Optional<User> findByUsername(String username);
}
