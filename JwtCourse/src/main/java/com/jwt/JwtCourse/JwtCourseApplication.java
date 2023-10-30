package com.jwt.JwtCourse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.File;

import static com.jwt.JwtCourse.security.constants.File.USER_FOLDER;

@SpringBootApplication
public class JwtCourseApplication {

	public static void main(String[] args) {

		SpringApplication.run(JwtCourseApplication.class, args);
		new File(USER_FOLDER).mkdirs();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder () {
		return new BCryptPasswordEncoder();
	}


}
