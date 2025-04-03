package com.taxi.ride.dto;

import com.taxi.ride.entities.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideDto {
    @NotBlank(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Driver ID is required")
    private Long driverId;

    private String customerFirstName;
    private String customerLastName;
    private String driverFirstName;
    private String driverLastName;

    private Status status = Status.REQUESTED;

    private LocalDateTime timeRequested = LocalDateTime.now();
    private LocalDateTime timeAccepted;
    private LocalDateTime timeArrived;
    private LocalDateTime timeCancelled;
    private LocalDateTime timeStarted;
    private LocalDateTime timeCompleted;

    @NotBlank(message = "Latitude1 is required!")
    private double startLatitude;
    @NotBlank(message = "Longitude1 is required!")
    private double startLongitude;
    @NotBlank(message = "Latitude2 is required!")
    private double endLatitude;
    @NotBlank(message = "Longitude2 is required!")
    private double endLongitude;

    private double distance;
}
