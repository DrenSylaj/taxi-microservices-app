package com.taxi.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DriverDTO {
    private String licenseNumber;
    private String vehicleModel;
    private String vehiclePlate;
    private int vehicleYear;
    private String vehicleColor;
}
