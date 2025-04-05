package com.taxi.user.clients;

import com.taxi.user.dto.RideAccepted;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="driver-service", url="${driver-service.url}")
public interface DriverClient {

    @PutMapping("/status/byUserId/{id}")
    void updateStatusByUserId(@RequestBody String role, @PathVariable Long id);

    @GetMapping("/getStatusByUserId/{id}")
    String getStatusByUserId(@PathVariable Long id);

}
