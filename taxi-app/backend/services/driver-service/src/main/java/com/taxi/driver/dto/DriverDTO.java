package com.taxi.driver.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DriverDTO {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "License number cannot be blank")
    private String licenseNumber;

    @NotBlank(message = "Vehicle model cannot be blank")
    private String vehicleModel;

    @NotBlank(message = "Vehicle plate cannot be blank")
    private String vehiclePlate;

    @Min(value = 1900, message = "Vehicle year must be valid")
    private int vehicleYear;

    @NotBlank(message = "Vehicle color cannot be blank")
    private String vehicleColor;
}
