package services.impl;

import dto.UserDto;
import models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import repository.KanbanRepository;
import repository.UserRepository;
import services.JWTService;
import services.UserService;
import utils.JwtWrapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private KanbanRepository kanbanRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Override
    public List<UserDto> findAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map((user) -> mapToUserDto(user)).collect(Collectors.toList());
    }

    @Override
    public void addUser(UserDto userDto) {
        User user = mapToUser(userDto);
        userRepository.save(user);
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()) {
            return Optional.of(mapToUserDto(user.get()));
        } else {
            return Optional.empty();
        }
    }

    @Override
    public void deleteByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()) {
            userRepository.delete(user.get());
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @Override
    public JwtWrapper verify(UserDto userDto) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword()));
        if(authentication.isAuthenticated()) {
            String token =  jwtService.generateToken(userDto.getEmail());
            String refreshToken = jwtService.generateRefreshToken(userDto.getEmail());
            return new JwtWrapper(token, refreshToken);
        } else {
            return new JwtWrapper("failure");
        }
    }

    @Override
    public String getAccessToken(String refreshToken) {
        if(jwtService.validateToken(refreshToken)) {
            return jwtService.generateToken(jwtService.extractEmail(refreshToken));
        } else {
            return "failure";
        }
    }

    @Override
    public UserDto getUserData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long kanbansLength = (long) kanbanRepository.findAll().stream()
                .filter(kanban -> kanban.getUser().equals(user))
                .count();
        return UserDto.builder()
                .firstName(user.getFirstName())
                .secondName(user.getSecondName())
                .email(user.getEmail())
                .kanbanDates(user.getKanbanDates())
                .kanbansLength(kanbansLength)
                .resolvedKanbans(user.getResolvedKanbans() == null ? 0 : user.getResolvedKanbans())
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .secondName(user.getSecondName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private User mapToUser(UserDto userDto) {
        return User.builder()
                //.id(userDto.getId())
                .firstName(userDto.getFirstName())
                .secondName(userDto.getSecondName())
                .email(userDto.getEmail())
                .password(encoder.encode(userDto.getPassword()))
                //.createdAt(userDto.getCreatedAt())
                //.updatedAt(userDto.getUpdatedAt())
                .build();
    }
}
