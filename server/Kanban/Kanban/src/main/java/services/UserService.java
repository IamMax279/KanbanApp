package services;

import dto.UserDto;
import models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import utils.JwtWrapper;

import java.util.List;
import java.util.Optional;

public interface UserService {
    //zwraca dto zeby nie zwracac calej encji
    List<UserDto> findAllUsers();
    void addUser(UserDto userDto);
    Optional<UserDto> findByEmail(String email);
    void deleteByEmail(String email);
    JwtWrapper verify(UserDto userDto);
    String getAccessToken(String refreshToken);
    UserDto getUserData(String email);
}
