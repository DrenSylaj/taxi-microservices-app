package com.taxi.communication.repository;

import com.taxi.communication.user.Status;
import com.taxi.communication.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    List<User> findAllByStatus(Status status);
}
