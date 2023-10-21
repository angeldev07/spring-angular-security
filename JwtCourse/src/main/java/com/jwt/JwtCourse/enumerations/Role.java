package com.jwt.JwtCourse.enumerations;


import lombok.Getter;

import static com.jwt.JwtCourse.security.constants.Authority.*;


@Getter
public enum Role {
    ROLE_USER(USER_AUTHORITIES),
    ROLE_HR(HR_AUTHORITIES),
    ROLE_ADMIN(ADMIN_AUTHORITIES),
    ROLE_SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities){
        this.authorities = authorities;
    }


    }
