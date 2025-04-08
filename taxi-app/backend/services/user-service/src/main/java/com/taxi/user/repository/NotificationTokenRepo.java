package com.taxi.user.repository;

import com.taxi.user.entities.NotificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface NotificationTokenRepo extends JpaRepository<NotificationToken, Long> {
    List<NotificationToken> findByUserId(Long id);
}
