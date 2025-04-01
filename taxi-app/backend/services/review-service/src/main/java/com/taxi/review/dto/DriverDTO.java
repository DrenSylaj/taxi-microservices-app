package com.taxi.review.dto;

import lombok.Data;

@Data
public class DriverDTO {

    private Long userId;
    private String licenseNumber;
    private CarDTO car;
}

