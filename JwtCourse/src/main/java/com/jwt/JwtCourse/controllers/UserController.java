package com.jwt.JwtCourse.controllers;

import com.jwt.JwtCourse.exceptions.ExceptionHandling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController extends ExceptionHandling {

    @GetMapping
    public String home () {
        return "Application it's working!!!!!";
    }

}
