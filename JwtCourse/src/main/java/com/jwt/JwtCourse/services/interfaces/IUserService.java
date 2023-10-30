package com.jwt.JwtCourse.services.interfaces;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.EmailExistException;
import com.jwt.JwtCourse.exceptions.EmailNotFoundException;
import com.jwt.JwtCourse.exceptions.UserNotFoundException;
import com.jwt.JwtCourse.exceptions.UsernameExistException;
import com.jwt.JwtCourse.http.DTO.AddUserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IUserService {

    User createUser(String firstName, String lastName, String username, String email, String password) throws UsernameExistException, EmailExistException;

    List<User> findAllUsers();

    User findUserByEmail(String email) throws EmailNotFoundException;

    User findUserByUsername(String username) throws UserNotFoundException;

    User addUser(AddUserDTO userDTO) throws EmailExistException, UsernameExistException, IOException;

    User deleteUser(Integer id);

    User updateUser(AddUserDTO userDTO) throws IOException;

    void resetPassword(String email, String newPassword);

    User updateProfileImg(String username, MultipartFile profileImg) throws IOException;

}
