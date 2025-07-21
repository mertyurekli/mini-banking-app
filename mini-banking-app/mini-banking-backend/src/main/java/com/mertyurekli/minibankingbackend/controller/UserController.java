package com.mertyurekli.minibankingbackend.controller;

import com.mertyurekli.minibankingbackend.dto.UserDto;
import com.mertyurekli.minibankingbackend.dto.UserLoginDto;
import com.mertyurekli.minibankingbackend.dto.UserRegistrationDto;
import com.mertyurekli.minibankingbackend.service.UserService;
import com.mertyurekli.minibankingbackend.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for user registration, login, and management")
public class UserController {

    private UserService userService;
    private JwtUtil jwtUtil;

    @Operation(summary = "Register a new user", description = "Creates a new user account")
    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody UserRegistrationDto registrationDto){
        UserDto savedUser = userService.registerUser(registrationDto);
        String jwtToken = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "token", jwtToken,
            "user", savedUser
        ));
    }

    @Operation(summary = "User login", description = "Authenticates user and returns JWT token")
    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserLoginDto loginDto){
        String jwtToken = userService.loginUser(loginDto);
        UUID userId = jwtUtil.extractUserId(jwtToken);
        UserDto userDto = userService.getUserById(userId);
        
        return ResponseEntity.ok(Map.of(
            "token", jwtToken,
            "user", userDto
        ));
    }

    @Operation(summary = "Get user by ID", description = "Retrieves user details by user ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") UUID userId){
        UserDto userDto = userService.getUserById(userId);
        return ResponseEntity.ok(userDto);
    }
    
    @Operation(summary = "Update user", description = "Updates existing user information")
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") UUID userId, @RequestBody UserDto userDto){
        UserDto updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Validate JWT token", description = "Validates JWT token and returns user information")
    @GetMapping("/validate")
    public ResponseEntity<UserDto> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                UUID userId = jwtUtil.extractUserId(token);
                UserDto userDto = userService.getUserById(userId);
                return ResponseEntity.ok(userDto);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
