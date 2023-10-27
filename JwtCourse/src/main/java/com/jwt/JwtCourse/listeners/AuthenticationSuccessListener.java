package com.jwt.JwtCourse.listeners;

import com.jwt.JwtCourse.security.impl.UserDetailsImpl;
import com.jwt.JwtCourse.services.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationSuccessListener {

    @Autowired
    private LoginAttemptService loginAttemptService;

    @EventListener
    public void onAuthenticationSuccessfulListener(AuthenticationSuccessEvent event) {
        Object user = event.getAuthentication().getPrincipal();

        if(! (user instanceof UserDetailsImpl userAuth) ) return;

        loginAttemptService.removeUserLoginAttempt(userAuth.getUsername());
    }

}
