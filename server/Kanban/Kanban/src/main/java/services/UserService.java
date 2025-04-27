package services;

import dto.UserDto;
import utils.JwtWrapper;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDto> findAllUsers();
    String addUser(UserDto userDto) throws Exception;
    Optional<UserDto> findByEmail(String email);
    void deleteByEmail(String email) throws IllegalArgumentException;
    void deleteByPassword(String password, String token) throws Exception;
    JwtWrapper verify(UserDto userDto);
    String getAccessToken(String refreshToken);
    UserDto getUserData(String email);
}
