package com.jwt.JwtCourse.services.interfaces;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.EmailExistException;
import com.jwt.JwtCourse.exceptions.EmailNotFoundException;
import com.jwt.JwtCourse.exceptions.UserNotFoundException;
import com.jwt.JwtCourse.exceptions.UsernameExistException;

import java.sql.SQLException;
import java.util.List;

public interface IUserService {

    User createUser(String firstName, String lastName, String username, String email, String password) throws UsernameExistException, EmailExistException;

    List<User> findAllUsers();

    User findUserByEmail(String email) throws EmailNotFoundException;

    User findUserByUsername(String username) throws UserNotFoundException;

}
