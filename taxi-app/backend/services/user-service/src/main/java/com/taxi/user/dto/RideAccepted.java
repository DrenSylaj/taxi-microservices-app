package com.taxi.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@RedisHash("RideAccepted")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideAccepted {

    private Long userId;
    private Long driverId;

    private Double latitude;
    private Double longitude;
}