package com.taxi.user.services;

import com.taxi.user.config.JwtService;
import com.taxi.user.dto.AuthDTO;
import com.taxi.user.dto.UserDTO;
import com.taxi.user.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserService userService;
    private final CostumerUserDetailsService costumerUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(UserDTO request){
        var user = userService.createUser(request);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtService.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .role(user.getRole().toString())
                .build();
    }

    public AuthResponse authenticate(AuthDTO request){
        String email = request.getEmail();
        String password = request.getPassword();

        Authentication authentication = authenticate(email, password);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        var jwtToken = jwtService.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwtToken)
                .role(role)
                .build();

    }

    private Authentication authenticate(String username, String password){
        UserDetails userDetails = costumerUserDetailsService.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username");
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
