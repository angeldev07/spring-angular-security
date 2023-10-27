package com.jwt.JwtCourse.controllers;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.EmailExistException;
import com.jwt.JwtCourse.exceptions.ExceptionHandling;
import com.jwt.JwtCourse.exceptions.UserNotFoundException;
import com.jwt.JwtCourse.exceptions.UsernameExistException;
import com.jwt.JwtCourse.http.DTO.UserRegisterDTO;
import com.jwt.JwtCourse.security.impl.UserDetailsImpl;
import com.jwt.JwtCourse.security.jwt.JwtUtils;
import com.jwt.JwtCourse.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.jwt.JwtCourse.security.constants.SecurityConstant.JWT_TOKEN_HEADEER;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(path = { "/", "/user"})
public class UserController extends ExceptionHandling {

    @Autowired
    private IUserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;


    @GetMapping
    public ResponseEntity<List<User>> home () {
        return ResponseEntity.ok(
                userService.findAllUsers()
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

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) throws UserNotFoundException {
        authenticate(user.getUsername(), user.getPassword());
        User loginUser = userService.findUserByUsername(user.getUsername());
        UserDetailsImpl userPrincipal = new UserDetailsImpl(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }
    private HttpHeaders getJwtHeader(UserDetailsImpl user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADEER, jwtUtils.createToken(user));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

}
