package com.mertyurekli.minibankingbackend.mapper;

import com.mertyurekli.minibankingbackend.dto.UserDto;
import com.mertyurekli.minibankingbackend.entity.User;

import java.time.LocalDateTime;

public class UserMapper {

    public static UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public static User mapToUser(UserDto userDto) {
        LocalDateTime now = LocalDateTime.now();
        return new User(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getPassword(),
                userDto.getEmail(),
                now,
                now
        );
    }
    
    public static User mapToUserForUpdate(UserDto userDto, User existingUser) {
        return new User(
                existingUser.getId(),
                userDto.getUsername(),
                userDto.getPassword(),
                userDto.getEmail(),
                existingUser.getCreatedAt(), 
                LocalDateTime.now()
        );
    }
}
