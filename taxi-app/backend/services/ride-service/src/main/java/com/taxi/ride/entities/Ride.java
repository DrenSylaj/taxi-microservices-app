package com.taxi.ride.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long driverId;
    @Column(nullable = false)
    private Long customerId;

    @Enumerated(EnumType.STRING)
    private Status status = Status.REQUESTED;

    private LocalDateTime timeRequested = LocalDateTime.now();
    private LocalDateTime timeAccepted;
    private LocalDateTime timeArrived;
    private LocalDateTime timeCancelled;
    private LocalDateTime timeStarted;
    private LocalDateTime timeCompleted;

    private double startLatitude;
    private double startLongitude;
    private double endLatitude;
    private double endLongitude;

    private double distance;
}
