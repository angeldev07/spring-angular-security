package com.jwt.JwtCourse.controllers;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.*;
import com.jwt.JwtCourse.http.DTO.AddUserDTO;
import com.jwt.JwtCourse.http.DTO.UserRegisterDTO;
import com.jwt.JwtCourse.http.DTO.UserResponseDTO;
import com.jwt.JwtCourse.http.requests.UpdatePassword;
import com.jwt.JwtCourse.services.interfaces.IUserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping( "/user")
public class UserController extends ExceptionHandling {

    @Autowired
    private IUserService userService;


    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestBody AddUserDTO userDTO) throws EmailExistException, IOException, UsernameExistException {
        User user = userService.addUser(userDTO);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> home () {
        return ResponseEntity.ok(
                userService.findAllUsers()
        );
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) throws UserNotFoundException {
        UserResponseDTO user = new UserResponseDTO();
        BeanUtils.copyProperties(userService.findUserByUsername(username), user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody AddUserDTO userDTO) throws IOException {
        User user = userService.updateUser(userDTO);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Boolean> deleteUser(@RequestParam Integer userId) throws UserNotFoundException {
       User user = userService.deleteUser(userId);
       return ResponseEntity.ok(user != null);
    }

    @PatchMapping("/updatePassword")
    public ResponseEntity<Boolean> updatePassword(@RequestBody UpdatePassword updatePassword) throws EmailNotFoundException {
        userService.resetPassword(updatePassword.getEmail(), updatePassword.getPassword());
        return ResponseEntity.ok(true);
    }


    @PatchMapping(value = "/update-profile-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileImg (@RequestParam("email") String email, @RequestPart("profileImg") MultipartFile img) throws IOException, UsernameNotFoundException {
        userService.updateProfileImg(email, img);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegisterDTO userRegister) throws EmailExistException, UsernameExistException {
        User newUser = userService.createUser(
                userRegister.getFirstName(),
                userRegister.getLastName(),
                userRegister.getUsername(),
                userRegister.getEmail(),
                userRegister.getPassword()

        );

        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }


}
