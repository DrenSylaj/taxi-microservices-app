package com.taxi.user.controllers;

import com.taxi.user.entities.NotificationToken;
import com.taxi.user.services.NotificationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
public class NotificationController {
    private final NotificationTokenService notificationTokenService;

    @GetMapping()
    public List<String> getAllTokens(){
        return notificationTokenService.getAllTokens();
    }

    @PostMapping()
    public Optional<NotificationToken> createToken(NotificationToken notif){
        return notificationTokenService.createNotification(notif);
    }

    @GetMapping("/{id}")
    public List<String> getTokensByUserId(@PathVariable Long id){
        return notificationTokenService.getTokenByUserId(id);
    }

}
