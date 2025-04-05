package com.taxi.user.controllers;

import com.taxi.user.dto.LocationDTO;
import com.taxi.user.dto.LocationUpdate;
import com.taxi.user.dto.RideOffer;
import com.taxi.user.dto.RideRequest;
import com.taxi.user.services.GeoLocationService;
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
        System.out.println("Hello there");
        return geoLocationService.getRideOffers(userId);
    }
}
