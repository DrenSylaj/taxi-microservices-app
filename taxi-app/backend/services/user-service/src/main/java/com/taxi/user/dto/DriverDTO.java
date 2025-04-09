package com.taxi.user.dto;

import lombok.Data;

@Data
public class DriverDTO {

    private Long userId;
    private String licenseNumber;
    private String carModel;
    private int numberOfSeats;
    private String carPlate;
    private int carYear;
    private String carColor;
}
