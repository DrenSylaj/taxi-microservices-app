package com.taxi.user.dto;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
public class RideRequest {

    private Long userId;

    private double latitude;
    private double longitude;
    private double destLatitude;
    private double destLongitude;
}
