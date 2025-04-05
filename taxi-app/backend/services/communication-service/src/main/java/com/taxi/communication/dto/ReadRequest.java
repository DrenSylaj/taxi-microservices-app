package com.taxi.communication.dto;

import lombok.Data;

@Data
public class ReadRequest {
    private String rideId;    // Which ride's messages to mark as read
    private String userId;    // Who is marking them as read (recipient)
}