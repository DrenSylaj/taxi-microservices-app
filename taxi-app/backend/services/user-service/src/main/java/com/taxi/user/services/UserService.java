package com.taxi.user.services;

import com.taxi.user.dto.UserDTO;
import com.taxi.user.entities.Role;
import com.taxi.user.entities.User;
import com.taxi.user.exceptions.UserAlreadyExistsException;
import com.taxi.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    public void deleteUserById(Long id){
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
        }
    }

    @Transactional
    public Optional<User> updateUserById(@Valid UserDTO updatedUser, Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if(updatedUser.getEmail() != null && !user.getEmail().equals(updatedUser.getEmail())){
                        userRepository.findByEmail(updatedUser.getEmail()).ifPresent(u -> {
                            throw new UserAlreadyExistsException("Email already in use");
                        });
                    }
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    user.setCity(updatedUser.getCity());
                    user.setAddress(updatedUser.getAddress());
                    user.setBirthDate(updatedUser.getBirthDate());
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                    user.setGender(updatedUser.isGender());

                    return userRepository.save(user);
                });
    }

    @Transactional
    public User createUser(@Valid UserDTO userDTO) {
        if(userRepository.findByEmail(userDTO.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("Email already in use");
        }

        User user = User.builder()
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .address(userDTO.getAddress())
                .city(userDTO.getCity())
                .gender(userDTO.isGender())
                .birthDate(userDTO.getBirthDate())
                .role(Role.CUSTOMER)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateRole(String role, Long userId){
        User user = getUserById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: "+userId));

        user.setRole(Role.valueOf(role));

        List<GrantedAuthority> updatedAuthorities =
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, updatedAuthorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return userRepository.save(user);
    }


}
