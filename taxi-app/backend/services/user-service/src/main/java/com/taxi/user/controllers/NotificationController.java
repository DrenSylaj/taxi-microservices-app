package com.taxi.user.controllers;

import com.taxi.user.dto.NotificationDTO;
import com.taxi.user.entities.NotificationToken;
import com.taxi.user.entities.User;
import com.taxi.user.services.NotificationTokenService;
import com.taxi.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
public class NotificationController {
    private final NotificationTokenService notificationTokenService;
    private final UserService userService;

    @GetMapping()
    public List<String> getAllTokens(){
        return notificationTokenService.getAllTokens();
    }

    @PostMapping()
    public Optional<NotificationToken> createToken(@RequestBody NotificationDTO notif){
        
        Optional<User> u = userService.getUserById(notif.getUserId());
        if(u.isPresent()) {
            NotificationToken notifToken = new NotificationToken();
            notifToken.setToken(notif.getToken());
            notifToken.setUser(u.get());
            return notificationTokenService.createNotification(notifToken);
        }
        throw new RuntimeException("User with ID " + notif.getUserId() + " not found");
    }

    @GetMapping("/{id}")
    public List<String> getTokensByUserId(@PathVariable Long id){
        return notificationTokenService.getTokenByUserId(id);
    }

}
