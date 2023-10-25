package com.jwt.JwtCourse.services;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

import static java.util.concurrent.TimeUnit.MINUTES;

@Service
public class LoginAttemptService {

    private static final byte MAX_LOGIN_ATTEMPT = 3;
    private static final byte ATTEMPT_INCREMENT = 1;

    private LoadingCache<String, Byte> loginAttemptCache;

    public LoginAttemptService() {
        super();
        this.loginAttemptCache = CacheBuilder.newBuilder()
                .expireAfterWrite(15, MINUTES)
                .maximumSize(100)
                .build(new CacheLoader<String, Byte>() {
                    @Override
                    public Byte load(String key) throws Exception {
                        return 0;
                    }
                });
    }

    public void removeUserLoginAttempt(String username){
        this.loginAttemptCache.invalidate(username);
    }

    public void  addUserToLoginAttempt(String username){
        byte attempt = 0;
        try {
              attempt = (byte) (ATTEMPT_INCREMENT + this.loginAttemptCache.get(username));
              this.loginAttemptCache.put(username, attempt);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isExceededAttempts(String username){
        try {
            byte userAttempt = this.loginAttemptCache.get(username);
            return userAttempt >= MAX_LOGIN_ATTEMPT;
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

}
