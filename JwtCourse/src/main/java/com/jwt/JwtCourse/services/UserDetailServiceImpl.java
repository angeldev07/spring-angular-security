package com.jwt.JwtCourse.services;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.respositories.UserRepository;
import com.jwt.JwtCourse.security.impl.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserDetailServiceImpl implements UserDetailsService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private EmailService emailService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username).orElseThrow();

        validateLoginAttempt(user);

        user.setLastLoginDateDisplay(user.getLastLoginDate());
        user.setLastLoginDate(new Date());
        userRepository.save(user);

        return new UserDetailsImpl(user);
    }

    private void validateLoginAttempt(User user) {
        if (user.isNotLocked()) {

            boolean hasBeenExceededAttempts = this.loginAttemptService.isExceededAttempts(user.getUsername());

            user.setNotLocked(! hasBeenExceededAttempts);

        } else {
            this.loginAttemptService.removeUserLoginAttempt(user.getUsername());
            emailService.sendEmail("pruebasbeclpbd@gmail.com", "Bloqueo de cuenta", "Su cuenta ha sido bloqueada por securidad al detectarse varios intentos fallidos de inicio de sesion. Pongase en contacto con soporte.");
        }
    }
}
