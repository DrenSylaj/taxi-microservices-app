package com.taxi.ride.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "driver-service", url = "${driver-service.url}")
public interface DriverClient {
    @GetMapping("/status/{id}")
    void updateStatus(@RequestBody String status, @PathVariable Long id);
}
