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
    public ResponseEntity<Map<String, String>> addUser(@RequestBody UserDto user) throws Exception {
        try {
            Map<String, String> response = new HashMap<>();

            if(user.getFirstName().isEmpty() || user.getSecondName().isEmpty() || user.getEmail().isEmpty() || user.getPassword().isEmpty()) {
                response.put("message", "Missing data");
                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
            }
            String result = userService.addUser(user);

            if(result.equals("failed to add user")) {
                throw new Exception(result);
            }

            response.put("message", "User added");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch(Error e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "an error occurred: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<Map<String, String>> deleteUser(@RequestHeader("Authorization") String auth, @RequestBody Map<String, String> body) {
        try {
            if(auth.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Missing authorization.");
                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
            }

            String token = auth.substring(7);
            userService.deleteByPassword(body.get("password"), token);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch(Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Something went wrong: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
