package com.jwt.JwtCourse.http.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserRegisterDTO {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;

}
