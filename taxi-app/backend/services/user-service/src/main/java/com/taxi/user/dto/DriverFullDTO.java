package com.taxi.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DriverFullDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
//    private boolean gender;
    private String city;
    private LocalDate birthDate;
    private String licenseNumber;
//    private String status;
    private String model;
    private int numberOfSeats;
    private String plateNumber;
    private int year;
    private String color;

}
