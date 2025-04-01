package com.taxi.driver.repository;

import com.taxi.driver.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository  extends JpaRepository<Car, Long> {
}
