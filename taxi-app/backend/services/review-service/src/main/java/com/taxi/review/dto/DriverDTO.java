package com.taxi.review.dto;

import lombok.Data;

@Data
public class DriverDTO {

    private Long Id;
    private Long userId;
    private String licenseNumber;
    private String vehicleModel;
    private String vehiclePlate;
    private int vehicleYear;
    private String vehicleColor;

}

