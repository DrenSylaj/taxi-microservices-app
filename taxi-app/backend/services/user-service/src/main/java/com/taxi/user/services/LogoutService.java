package com.taxi.user.services;

import com.taxi.user.entities.Token;
import com.taxi.user.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    private final TokenRepository repository;
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;

        if(authHeader == null || !authHeader.startsWith("Bearer")){
            return;
        }

        jwt = authHeader.substring(7);

        Token token = repository.findByToken(jwt)
                .orElse(null);
        if(token != null){
            token.setRevoked(true);
            token.setExpired(true);
            repository.save(token);
            SecurityContextHolder.clearContext();
        }

    }
}
