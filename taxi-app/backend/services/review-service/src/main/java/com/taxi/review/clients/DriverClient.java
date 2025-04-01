package com.taxi.review.clients;


import com.taxi.review.dto.DriverDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="driver-service", url="${driver-service.url}")
public interface DriverClient {

    @GetMapping("/{id}")
    DriverDTO getDriverById(@PathVariable Long id);
}
