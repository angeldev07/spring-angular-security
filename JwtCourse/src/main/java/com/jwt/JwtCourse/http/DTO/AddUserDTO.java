package com.jwt.JwtCourse.http.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nonnull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddUserDTO {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String role;
    private boolean nonLocked;
    private boolean active;
    private MultipartFile profileImg;

}
