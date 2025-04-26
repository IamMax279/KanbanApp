package services;

import dto.UserDto;
import utils.JwtWrapper;

import java.util.List;
import java.util.Optional;

public interface UserService {
    //zwraca dto zeby nie zwracac calej encji
    List<UserDto> findAllUsers();
    String addUser(UserDto userDto) throws Exception;
    Optional<UserDto> findByEmail(String email);
    void deleteByEmail(String email);
    JwtWrapper verify(UserDto userDto);
    String getAccessToken(String refreshToken);
    UserDto getUserData(String email);
}
