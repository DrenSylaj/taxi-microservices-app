package com.taxi.user.controllers;

import com.taxi.user.dto.AuthDTO;
import com.taxi.user.dto.UserDTO;
import com.taxi.user.response.AuthResponse;
import com.taxi.user.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO request){
        try{
            return ResponseEntity.ok(authService.register(request));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(request.getEmail());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> auth(@RequestBody AuthDTO request){
        return ResponseEntity.ok(authService.authenticate(request));
    }


}
