package com.taxi.ride.controllers;

import com.taxi.ride.dto.RideDto;
import com.taxi.ride.entities.Ride;
import com.taxi.ride.entities.Status;
import com.taxi.ride.services.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ride")
@RequiredArgsConstructor
public class RideController {
    private final RideService rideService;

    @GetMapping("/{id}")
    public Ride getRideById(@PathVariable Long rideId){
        return rideService.getRideById(rideId);
    }

    @GetMapping
    public List<RideDto> getAllRides(){
        return rideService.getAllRides();
    }

    @PostMapping
    public Ride createRide(@RequestBody RideDto rideDto){
        return rideService.createRide(rideDto);
    }

    @PutMapping("/{id}")
    public Ride updateRide(@RequestBody RideDto rideDto,@PathVariable Long rideId){
        return rideService.updateRide(rideDto, rideId);
    }

    @DeleteMapping("/{id}")
    public void deleteRide(@PathVariable Long rideId){
        rideService.deleteRide(rideId);
    }

    @PutMapping("/status/{id}")
    public Ride updateStatus(@RequestBody String status, @PathVariable Long id){
        Status statusEnum = Status.valueOf(status.toUpperCase().trim());
        return rideService.updateStatus(statusEnum, id);
    }
}
