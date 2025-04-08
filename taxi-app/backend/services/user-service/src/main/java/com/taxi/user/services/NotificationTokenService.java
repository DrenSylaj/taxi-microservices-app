package com.taxi.user.services;

import com.taxi.user.entities.NotificationToken;
import com.taxi.user.repository.NotificationTokenRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationTokenService {
    private final NotificationTokenRepo notificationTokenService;



    public List<String> getAllTokens() {
        List<NotificationToken> all = notificationTokenService.findAll();
        List<String> tokens = new ArrayList<>();
        for (NotificationToken notificationToken : all) {
            tokens.add(notificationToken.getToken());
        }
        return tokens;
    }

    public  Optional<NotificationToken> createNotification(NotificationToken notif){
        return Optional.of(notificationTokenService.save(notif));
    }

    public List<String> getTokenByUserId(Long id){
        List<NotificationToken> all = notificationTokenService.findByUserId(id);
        List<String> tokens = new ArrayList<>();
        for (NotificationToken notificationToken : all) {
            tokens.add(notificationToken.getToken());
        }
        return tokens;
    }


}
