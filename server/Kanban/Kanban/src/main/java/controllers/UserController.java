package controllers;


import dto.UserDto;
import models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import services.UserService;
import utils.JwtWrapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//Gdy kontroler (lub inny komponent) zgłasza potrzebę wstrzyknięcia zależności
// typu UserService, Spring dostarcza implementację UserServiceImpl.
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/getusers")
    public List<UserDto> getUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/getuserbyemail") //nie używam tutaj @RequestBody bo to get request
    //zamiast tego używam @RequestParam aby przekazać email
    public Optional<UserDto> getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @GetMapping("/getuserdata")
    public UserDto getUserData(@RequestParam String email) {
        return userService.getUserData(email);
    }

    @PostMapping("/adduser")
    public ResponseEntity<String> addUser(@RequestBody UserDto user) {
        try {
            if(user.getFirstName().isEmpty() || user.getSecondName().isEmpty() || user.getEmail().isEmpty() || user.getPassword().isEmpty()) {
                return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
            }
            userService.addUser(user);
            return new ResponseEntity<>("User added", HttpStatus.OK);
        } catch(Error e) {
            return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getaccesstoken")
    public ResponseEntity<Map<String, String>> getAccessToken(@RequestParam String refreshToken) {
        String newAccessToken = userService.getAccessToken(refreshToken);
        if(newAccessToken == null) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        Map<String, String> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public JwtWrapper login(@RequestBody UserDto user) {
        return userService.verify(user);
    }

    @DeleteMapping("/deleteuser")
    public ResponseEntity<String> deleteUser(@RequestParam String email) {
        try {
            userService.deleteByEmail(email);
            return new ResponseEntity<>("User deleted", HttpStatus.OK);
        } catch(Error e) {
            return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
        }
    }
}
