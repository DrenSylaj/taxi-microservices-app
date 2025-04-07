package com.taxi.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RideOffer {

    private Long userId;
    private Long driverId;

    private Double latitude;
    private Double longitude;
    private Double destLatitude;
    private Double destLongitude;

}