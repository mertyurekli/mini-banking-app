package com.mertyurekli.minibankingbackend.service;

import com.mertyurekli.minibankingbackend.dto.UserDto;
import com.mertyurekli.minibankingbackend.dto.UserLoginDto;
import com.mertyurekli.minibankingbackend.dto.UserRegistrationDto;

import java.util.UUID;

public interface UserService {
    UserDto registerUser(UserRegistrationDto registrationDto);
    
    String loginUser(UserLoginDto loginDto);

    UserDto getUserById(UUID userId);
    
    UserDto updateUser(UUID userId, UserDto userDto);
}
