package com.jwt.JwtCourse.services;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.exceptions.EmailExistException;
import com.jwt.JwtCourse.exceptions.EmailNotFoundException;
import com.jwt.JwtCourse.exceptions.UserNotFoundException;
import com.jwt.JwtCourse.exceptions.UsernameExistException;
import com.jwt.JwtCourse.respositories.UserRepository;
import com.jwt.JwtCourse.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import static com.jwt.JwtCourse.enumerations.Role.ROLE_USER;

@Service
public class UserService implements IUserService {


    public static final String IS_ALREADY_USE = "The %s is already use";
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public User createUser(String firstName, String lastName, String username, String email, String password) throws UsernameExistException, EmailExistException {

        //Check if the user Exist with the username or email
        isUserExistWithUsernameOrEmail(username, email);

        // if pass the line 40 we can send the email

        emailService.sendEmail(email, "Success register account", "Your account has been create successful");

        return userRepository.save(
                new User()
                        .builder()
                        .userId(UUID.randomUUID().toString())
                        .firstName(firstName)
                        .lastName(lastName)
                        .username(username)
                        .email(email)
                        .password(bCryptPasswordEncoder.encode(password))
                        .joinDate(new Date())
                        .isActive(true)
                        .isNotLocked(true)
                        .role(ROLE_USER.name())
                        .authorities(ROLE_USER.getAuthorities())
                        .build()
        );
    }

    @Override
    public List<User> findAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public User findUserByUsername(String username) throws UserNotFoundException {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("the username: "+username+" do not exists."));
    }

    @Override
    public User findUserByEmail(String email) throws  EmailNotFoundException{
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("the username: "+email+" do not exists."));
    }

    /********************** CLASS METHOD*************************/

    private void isUserExistWithUsernameOrEmail(String username, String email) throws  UsernameExistException, EmailExistException{
        User user = userRepository.findUserByUsernameOrEmail(username, email).orElse( null);

        if(user == null)  return ;

        if(user.getUsername().equalsIgnoreCase(username) )
            throw  new UsernameExistException(String.format(IS_ALREADY_USE, "username").toUpperCase());

        if(user.getEmail().equalsIgnoreCase(email))
            throw new EmailExistException(String.format(IS_ALREADY_USE, "email").toUpperCase());

    }

}
