package com.taxi.driver.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(unique = true, nullable = false)
    private Long userId;

    private String licenseNumber;
    private String vehicleModel;
    private String vehiclePlate;
    private int vehicleYear;
    private String vehicleColor;

    @Enumerated(EnumType.STRING)
    private DriverStatus status = DriverStatus.OFFLINE;
}

