package controllers;


import dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> addUser(@RequestBody UserDto user) throws Exception {
        try {
            if(user.getFirstName().isEmpty() || user.getSecondName().isEmpty() || user.getEmail().isEmpty() || user.getPassword().isEmpty()) {
                return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
            }
            String result = userService.addUser(user);

            if(result.equals("failed to add user")) {
                throw new Exception(result);
            }

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

    @PostMapping("/delete-user")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String auth, @RequestBody String password) {
        try {
            if(auth.trim().isEmpty()) {
                return new ResponseEntity<>("Missing authorization", HttpStatus.FORBIDDEN);
            }

            userService.deleteByPassword(password, auth);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>("Something went wrong: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
