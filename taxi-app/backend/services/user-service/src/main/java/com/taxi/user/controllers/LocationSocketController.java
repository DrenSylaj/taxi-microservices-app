package com.taxi.user.controllers;

import com.taxi.user.dto.LocationUpdate;
import com.taxi.user.services.GeoLocationService;
import lombok.AllArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.domain.geo.GeoLocation;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@AllArgsConstructor
public class LocationSocketController {

    private GeoLocationService gls;

    @MessageMapping("/updateLocation")
    @SendTo("/topic/update")
    public LocationUpdate updateLocation(@Payload LocationUpdate locationUpdate) {

        gls.updateUserLocation(locationUpdate.getUserId(),
                            locationUpdate.getLatitude(),
                            locationUpdate.getLongitude());

        return locationUpdate;
    }

    @MessageMapping("/getAllUsers")
    @SendTo("/topic/allUsers")
    public List<LocationUpdate> getAllUsers() {
        System.out.println("Received request for all users");
        return gls.getAllUsers();
    }

//    @MessageMapping("/requestRide")
//    public void requestRide(@Payload RideRequest rideRequest, SimpMessagingTemplate messagingTemplate) {
//        List<String> nearbyDrivers = glo.findNearbyUsers(
//                rideRequest.getLatitude(),
//                rideRequest.getLongitude(),
//                5.0
//        );
//
//        for (String driverId : nearbyDrivers) {
//            messagingTemplate.convertAndSend("/topic/rideRequests/" + driverId, rideRequest);
//        }
//    }
}
