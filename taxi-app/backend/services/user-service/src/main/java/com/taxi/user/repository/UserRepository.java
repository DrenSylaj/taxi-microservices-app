package com.taxi.user.repository;

import com.taxi.user.entities.Role;
import com.taxi.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByIdAndRole(Long id, Role role);
}
