package com.taxi.review.dto;

import lombok.Data;

@Data
public class CarDTO {

    private String model;
    private int numberOfSeats;
    private String plate;
    private int year;
    private String color;
}
