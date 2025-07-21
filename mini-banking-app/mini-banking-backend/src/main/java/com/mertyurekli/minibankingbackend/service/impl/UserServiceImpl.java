package com.mertyurekli.minibankingbackend.service.impl;

import com.mertyurekli.minibankingbackend.dto.UserDto;
import com.mertyurekli.minibankingbackend.dto.UserLoginDto;
import com.mertyurekli.minibankingbackend.dto.UserRegistrationDto;
import com.mertyurekli.minibankingbackend.entity.User;
import com.mertyurekli.minibankingbackend.exception.ResourceNotFoundException;
import com.mertyurekli.minibankingbackend.mapper.UserMapper;
import com.mertyurekli.minibankingbackend.repository.UserRepository;
import com.mertyurekli.minibankingbackend.service.UserService;
import com.mertyurekli.minibankingbackend.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    @Override
    public UserDto registerUser(UserRegistrationDto registrationDto) {
        // Check if username already exists
        if (userRepository.findByUsername(registrationDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        // Convert registration DTO to User entity
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setEmail(registrationDto.getEmail());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        
        User savedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public String loginUser(UserLoginDto loginDto) {
        // Find user by username
        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate JWT token
        return jwtUtil.generateToken(user.getId(), user.getUsername());
    }

    @Override
    public UserDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
        return UserMapper.mapToUserDto(user);
    }
    
    @Override
    public UserDto updateUser(UUID userId, UserDto userDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
        
        User updatedUser = UserMapper.mapToUserForUpdate(userDto, existingUser);
        User savedUser = userRepository.save(updatedUser);
        
        return UserMapper.mapToUserDto(savedUser);
    }
}
