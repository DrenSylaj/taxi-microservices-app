package com.taxi.driver.repository;

import com.taxi.driver.entities.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Verification findByUserId(Long userId);
}
