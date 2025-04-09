package com.taxi.user.controllers;

import com.taxi.user.dto.*;
import com.taxi.user.services.GeoLocationService;
import com.taxi.user.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class LocationController {

    private final GeoLocationService geoLocationService;
    private final UserService userService;

    @GetMapping("/{userId}/location")
    public ResponseEntity<LocationDTO> getUserLocation(@PathVariable Long userId) {
        Point point = geoLocationService.getUserLocation(userId);
        LocationDTO locationDTO = new LocationDTO(point.getY(), point.getX());
        return ResponseEntity.ok(locationDTO);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/nearby")
    public List<RideRequest> getNearbyRequests(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") double radiusKm,
            @RequestParam Long driverId
    ) {
        return geoLocationService.getNearbyRideRequests(latitude, longitude, radiusKm, driverId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/rideOffers")
    public List<RideOffer> getOffers(
            @RequestParam Long userId
    ) {
        return geoLocationService.getRideOffers(userId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/currentRideDriver")
    public RideAccepted getCurrentRideDriver(
            @RequestParam Long driverId
    ) {
        return geoLocationService.getCurrentRideDriver(driverId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/currentRideUser")
    public RideAccepted getCurrentRideUser(
            @RequestParam Long userId
    ) {
        return geoLocationService.getCurrentRideUser(userId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/driverInfo/{userId}")
    public DriverFullDTO getDriverFullInfo(
            @PathVariable Long userId
    ) {
        return userService.getFullDriver(userId);
    }

//    @CrossOrigin(origins = "http://localhost:5173")
//    @GetMapping("/activeCloseBy")
//    public List<Long> activeCloseBy(@RequestBody RideRequest request) {
//       return geoLocationService.activeCloseBy(request);
//    }


}
