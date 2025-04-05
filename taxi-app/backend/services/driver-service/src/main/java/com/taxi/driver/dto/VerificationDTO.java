package com.taxi.driver.dto;

import com.taxi.driver.entities.VerificationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationDTO {
    @NotBlank(message = "User Id cannot be blank")
    private Long userId;
    private VerificationStatus status = VerificationStatus.REQUESTED;
    private Long adminId;
    private LocalDateTime timeRequested = LocalDateTime.now();
    private LocalDateTime timeUpdated;
    @NotBlank(message = "License Number cannot be blank")
    private String licenseNumber;

    @NotBlank(message = "Model field cannot be blank")
    private String model;

    @NotBlank(message = "Number of seats field cannot be blank")
    private int numberOfSeats;

    @NotBlank(message = "Plate number field cannot be blank")
    private String plateNumber;

    @NotBlank(message = "Year field cannot be blank")
    private int year;

    @NotBlank(message = "Color field cannot be blank")
    private String color;
}
