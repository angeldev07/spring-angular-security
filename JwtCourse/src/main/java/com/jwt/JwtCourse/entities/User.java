package com.jwt.JwtCourse.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "user")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    private Integer id;

    private String userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String username;

    private String password;

    @Email
    @Column(unique = true)
    private String email;

    private String profileImgUrl;

    private Date lastLoginDate;

    private Date lastLoginDateDisplay;

    private Date joinDate;

    private String role;

    private String[] authorities;

    private boolean isActive;

    private boolean isNotLocked;


}
