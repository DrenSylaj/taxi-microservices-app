package com.taxi.driver.repository;

import com.taxi.driver.entities.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Driver findByUserId(Long userId);
}
