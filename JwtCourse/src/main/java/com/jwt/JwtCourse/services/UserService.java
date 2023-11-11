package com.jwt.JwtCourse.services;

import com.jwt.JwtCourse.entities.User;
import com.jwt.JwtCourse.enumerations.Role;
import com.jwt.JwtCourse.exceptions.EmailExistException;
import com.jwt.JwtCourse.exceptions.EmailNotFoundException;
import com.jwt.JwtCourse.exceptions.UserNotFoundException;
import com.jwt.JwtCourse.exceptions.UsernameExistException;
import com.jwt.JwtCourse.http.DTO.AddUserDTO;
import com.jwt.JwtCourse.respositories.UserRepository;
import com.jwt.JwtCourse.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static com.jwt.JwtCourse.enumerations.Role.ROLE_USER;
import static com.jwt.JwtCourse.security.constants.File.*;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

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
                .orElseThrow(() -> new UsernameNotFoundException("the username: " + username + " do not exists."));
    }

    @Override
    public User addUser(AddUserDTO userDTO) throws EmailExistException, UsernameExistException, IOException {
        isUserExistWithUsernameOrEmail(userDTO.getUsername(), userDTO.getEmail());
        User user = new User().builder()
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .userId(UUID.randomUUID().toString())
                .role(Role.valueOf(userDTO.getRole()).name())
                .authorities(Role.valueOf(userDTO.getRole()).getAuthorities())
                .isNotLocked(userDTO.isNonLocked())
                .isActive(userDTO.isActive())
                .profileImgUrl(null)
                .joinDate(new Date())
                .build();
        userRepository.save(user);
        return user;
    }

    @Override
    public User deleteUser(Integer id) throws  UserNotFoundException{
        User user = userRepository.findById(id).orElseThrow();
        userRepository.deleteById(id);
        return user;
    }

    @Override
    public User updateUser(AddUserDTO userDTO) throws IOException {
        User currentUser = userRepository.findUserByUsername(userDTO.getUsername()).get();
        currentUser.setFirstName(userDTO.getFirstName());
        currentUser.setLastName(userDTO.getLastName());
        currentUser.setUsername(userDTO.getUsername());
        currentUser.setEmail(userDTO.getEmail());
        currentUser.setRole(Role.valueOf(userDTO.getRole()).name());
        currentUser.setAuthorities(Role.valueOf(userDTO.getRole()).getAuthorities());
        currentUser.setNotLocked(userDTO.isNonLocked());
        currentUser.setActive(userDTO.isActive());
        userRepository.save(currentUser);
        saveProfileImg(currentUser, userDTO.getProfileImg());
        return null;
    }

    @Override
    public void resetPassword(String email, String newPassword) throws EmailNotFoundException{
        User user = userRepository.findUserByEmail(email).orElseThrow();
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
        emailService.sendEmail(email, "Changed password", "Your new password was updated successfully");
    }

    @Override
    public void updateProfileImg(String username, MultipartFile profileImg) throws IOException, UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException("The user does not exists") );
        saveProfileImg(user, profileImg);
    }

    @Override
    public User findUserByEmail(String email) throws EmailNotFoundException {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("the username: " + email + " do not exists."));
    }

    /********************** CLASS METHOD*************************/

    private void isUserExistWithUsernameOrEmail(String username, String email) throws UsernameExistException, EmailExistException {
        User user = userRepository.findUserByUsernameOrEmail(username, email).orElse(null);

        if (user == null) return;

        if (user.getUsername().equalsIgnoreCase(username))
            throw new UsernameExistException(String.format(IS_ALREADY_USE, "username").toUpperCase());

        if (user.getEmail().equalsIgnoreCase(email))
            throw new EmailExistException(String.format(IS_ALREADY_USE, "email").toUpperCase());

    }

    private void saveProfileImg(User user, MultipartFile profileImg) throws IOException {
        if (profileImg != null) {

            Path userFolder = Paths.get(USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();

            if (!Files.exists(userFolder)) {
                Files.createDirectories(userFolder);
            }

            Files.deleteIfExists(Path.of(USER_FOLDER + user.getUsername() + FORWARD_SLASH + user.getUsername() + DOT + JPG_EXTENSION ));
            Files.write(userFolder.resolve(user.getUsername() + DOT + JPG_EXTENSION), profileImg.getBytes());
            user.setProfileImgUrl(getPathUserProfile( USER_IMG_PATH + user.getUsername() + FORWARD_SLASH + user.getUsername() + DOT + JPG_EXTENSION ));
            userRepository.save(user);
        }
    }

    private String getPathUserProfile(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(username).toUriString();
    }

}
