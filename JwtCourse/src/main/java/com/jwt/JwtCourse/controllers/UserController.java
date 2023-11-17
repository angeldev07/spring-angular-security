package com.jwt.JwtCourse.controllers;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.*;
import com.jwt.JwtCourse.http.DTO.AddUserDTO;
import com.jwt.JwtCourse.http.DTO.UserRegisterDTO;
import com.jwt.JwtCourse.http.DTO.UserResponseDTO;
import com.jwt.JwtCourse.http.requests.UpdatePassword;
import com.jwt.JwtCourse.http.responses.HttpResponse;
import com.jwt.JwtCourse.services.interfaces.IUserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping( "/user")
public class UserController extends ExceptionHandling {

    @Autowired
    private IUserService userService;

    @PreAuthorize("hasAuthority('user:create')")
    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestBody AddUserDTO userDTO) throws EmailExistException, IOException, UsernameExistException {
        User user = userService.addUser(userDTO);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> home () {
        return ResponseEntity.ok(
                userService.findAllUsers().stream().map(user -> {
                    UserResponseDTO userResponseDTO = new UserResponseDTO();
                    BeanUtils.copyProperties(user, userResponseDTO);
                    return userResponseDTO;
                }).collect(Collectors.toList())
        );
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) throws UserNotFoundException {
        UserResponseDTO user = new UserResponseDTO();
        BeanUtils.copyProperties(userService.findUserByUsername(username), user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<HttpResponse> updateUserProfile(@RequestPart("userData") AddUserDTO userDTO) throws IOException {
        User user = userService.updateUser(userDTO);
        return new ResponseEntity<>(
                new HttpResponse(HttpStatus.OK.value(), HttpStatus.OK, HttpStatus.OK.getReasonPhrase() ,"Personal information updated!" ),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAuthority('user:update')")
    @PutMapping(value= "/update",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> updateUser(@RequestPart("userData") AddUserDTO userDTO,
                                           @RequestPart(value = "profileImg", required = false) MultipartFile profileImg) throws IOException {
        System.out.println(profileImg);
        userDTO.setProfileImg(profileImg);
        User user = userService.updateUser(userDTO);
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        BeanUtils.copyProperties(user, userResponseDTO);
        return new ResponseEntity<>(
                userResponseDTO,
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAuthority('user:delete')")
    @DeleteMapping("/delete")
    public ResponseEntity<HttpResponse> deleteUser(@RequestParam Integer userId) throws UserNotFoundException {
       User user = userService.deleteUser(userId);
       return new ResponseEntity<HttpResponse>(
               new HttpResponse(HttpStatus.OK.value(), HttpStatus.OK, HttpStatus.OK.getReasonPhrase(), "User deletes successfully"),
               HttpStatus.OK
       );
    }

    @PatchMapping("/updatePassword")
    public ResponseEntity<HttpResponse> updatePassword(@RequestBody UpdatePassword updatePassword) throws EmailNotFoundException {
        userService.resetPassword(updatePassword.getEmail(), updatePassword.getPassword());
        return new ResponseEntity<HttpResponse>(
                new HttpResponse(HttpStatus.OK.value(), HttpStatus.OK, HttpStatus.OK.getReasonPhrase(), "Password updated successfully"),
                HttpStatus.OK
        );
    }


    @PatchMapping(value = "/update-profile-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HttpResponse> updateProfileImg (@RequestPart("username") String username, @RequestPart("profileImg") MultipartFile img) throws IOException, UsernameNotFoundException {
        userService.updateProfileImg(username, img);
        return new ResponseEntity<>(
                new HttpResponse(HttpStatus.OK.value(), HttpStatus.OK, HttpStatus.OK.getReasonPhrase() ,"Photo updated successfuly" ),
                HttpStatus.OK
        );
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
