package com.taxi.driver.repository;

import com.taxi.driver.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarRepository  extends JpaRepository<Car, Long> {
    Optional<Car> findByUserId(Long userId);
}
