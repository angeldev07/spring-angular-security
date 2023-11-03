package com.jwt.JwtCourse.http.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String profileImgUrl;

    private Date lastLoginDateDisplay;

    private Date joinDate;

    private String role;

    private String[] authorities;

    private boolean isActive;

    private boolean isNotLocked;

}
