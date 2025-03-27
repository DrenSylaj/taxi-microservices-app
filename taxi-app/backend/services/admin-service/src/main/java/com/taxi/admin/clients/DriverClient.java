package com.taxi.admin.clients;

import com.taxi.admin.dto.DriverDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "driver-service", url = "${driver-service.url}")
public interface DriverClient {
    @GetMapping("/{id}")
    public DriverDTO findById(@PathVariable Long id);

    @GetMapping
    public List<DriverDTO> drivers();
}
