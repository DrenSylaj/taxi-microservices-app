package com.taxi.review.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@AllArgsConstructor
@Data
public class Review {

    @Id
    private String id;
    private String driverId;
    private String userId;
    private int rating;
    private String comment;
    private LocalDateTime localDateTime;
}
