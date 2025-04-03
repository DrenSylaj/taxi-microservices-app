package com.taxi.driver.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false, unique = true)
    private int numberOfSeats;

    @Column(nullable = false, unique = true)
    private String plateNumber;

    @Column(nullable = false)
    private int year;

    private String color;

}
