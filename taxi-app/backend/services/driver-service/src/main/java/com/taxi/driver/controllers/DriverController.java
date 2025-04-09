package com.taxi.driver.controllers;

import com.taxi.driver.dto.DriverDTO;
import com.taxi.driver.dto.VerificationDTO;
import com.taxi.driver.entities.Driver;
import com.taxi.driver.entities.Verification;
import com.taxi.driver.services.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/driver")
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return driverService.getDriverById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Driver createDriver(@Valid @RequestBody DriverDTO driverDTO) {
        return driverService.createDriver(driverDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverDTO updatedDriver) {
        return driverService.updateDriver(id, updatedDriver)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDriver(@PathVariable Long id) {
        driverService.deleteDriverById(id);
    }


    @PutMapping("/status/{id}")
    public ResponseEntity<Driver> updateStatus(@RequestBody String status, @PathVariable Long id){
        return driverService.updateStatus(status, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/status/byUserId/{id}")
    public ResponseEntity<Driver> updateStatusByUserId(@RequestBody String status, @PathVariable Long id){
        return driverService.updateStatusByUserId(status, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getStatusByUserId/{id}")
    public String getStatusByUserId(@PathVariable Long id) {
        return driverService.getStatusByUserId(id);
    }

    @PostMapping("/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> applyForDriver(@RequestBody VerificationDTO verificationDTO) {
        driverService.applyForDriver(verificationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Driver application submitted successfully");
    }

    @PostMapping("/approve/{id}")
    public Driver approveVerification(@PathVariable Long id){
        return driverService.approveVerification(id);
    }

    @PutMapping("/reject/{id}")
    public Verification rejectVerification(@PathVariable Long id){
        return driverService.rejectVerification(id);
    }

    @GetMapping("/getDriverByUserid/{userId}")
    public DriverDTO getDriverByUserid(@PathVariable Long userId) { return driverService.getDriverByUserId(userId); }
}