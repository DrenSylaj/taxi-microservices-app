package com.taxi.driver.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DriverDTO {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "License number cannot be blank")
    private String licenseNumber;

    @NotBlank(message = "Car model cannot be blank")
    private String carModel;

    @Min(value = 1, message = "Minimum available Seats for a car is 1!")
    private int numberOfSeats;

    @NotBlank(message = "Car plate cannot be blank")
    private String carPlate;

    @Min(value = 1900, message = "Car year must be valid")
    private int carYear;

    @NotBlank(message = "Car color cannot be blank")
    private String carColor;
}

