package com.taxi.user.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxi.user.config.JwtService;
import com.taxi.user.dto.AuthDTO;
import com.taxi.user.dto.UserDTO;
import com.taxi.user.entities.Token;
import com.taxi.user.entities.User;
import com.taxi.user.repository.TokenRepository;
import com.taxi.user.repository.UserRepository;
import com.taxi.user.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserService userService;
    private final CostumerUserDetailsService costumerUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public AuthResponse register(UserDTO request){
        var user = userService.createUser(request);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var jwt = jwtService.generateToken(authentication);
        var refreshToken = jwtService.generateRefreshToken(user.getEmail());
        saveUserToken(user, jwt);

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .role("ROLE_"+user.getRole().toString())
                .build();
    }

    public AuthResponse authenticate(AuthDTO request){
        String email = request.getEmail();
        String password = request.getPassword();

        Authentication authentication = authenticate(email, password);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        var jwtToken = jwtService.generateToken(authentication);
        var refreshToken = jwtService.generateRefreshToken(email);
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        revokeAllUserToken(user);
        saveUserToken(user, jwtToken);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .role("ROLE_"+role)
                .build();

    }

    private void revokeAllUserToken(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if(validUserTokens.isEmpty()){
            return;
        }
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });

        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwtToken){
        var token = Token
                .builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException{
        final String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        final String refreshToken = authHeader.substring(7);
        final String userEmail = jwtService.getEmailFromJwt(refreshToken);

        if(userEmail != null){
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new NotFoundException("User not found!"));

            if(jwtService.isTokenValid(refreshToken, user)){
                Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String newAccessToken = jwtService.generateToken(authentication);

                revokeAllUserToken(user);
                saveUserToken(user, newAccessToken);

                AuthResponse authResponse = AuthResponse.builder()
                        .token(newAccessToken)
                        .refreshToken(refreshToken)
                        .build();

                response.setContentType("application/json");
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
            else{
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            }
        }
        else{
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
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
