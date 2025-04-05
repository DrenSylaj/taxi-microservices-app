package com.taxi.user.clients;

import com.taxi.user.dto.RideAccepted;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="ride-service", url="${ride-service.url}")
public interface RideClient {

    @GetMapping("/{id}")
    RideAccepted createRide(@RequestBody RideAccepted rideDto);

    @PutMapping("/role/{id}")
    void updateRole(@RequestBody String role, @PathVariable Long id);
}
