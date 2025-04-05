package com.taxi.user.controllers;

import com.taxi.user.dto.AuthDTO;
import com.taxi.user.dto.UserDTO;
import com.taxi.user.entities.User;
import com.taxi.user.response.AuthResponse;
import com.taxi.user.services.AuthService;
import com.taxi.user.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO request){
        try{
            return ResponseEntity.ok(authService.register(request));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(request.getEmail());
        }
    }

//    Vetem per testim te servisi me komunikim e heqi kur ta perfundoj
        @GetMapping("/{id}")
        public ResponseEntity<User> getUserById(@PathVariable Long id){
            return userService.getUserById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> auth(@RequestBody AuthDTO request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request,
                             HttpServletResponse response) throws IOException{
        authService.refreshToken(request, response);
    }


}
