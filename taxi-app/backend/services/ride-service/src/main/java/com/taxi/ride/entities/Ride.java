package com.taxi.ride.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document
@Data
@Builder
@AllArgsConstructor
public class Ride {

    //Testing
    //TODO - Finish all the attributes required for this piece of shit Service called Ride
    private String id;
    private Long costumerId;
    private Long driverId;
    private LocalDate timeStarted;
    private LocalDate timeEnded;
}
