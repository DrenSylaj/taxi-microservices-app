package com.taxi.user.controllers;

import com.taxi.user.clients.DriverClient;
import com.taxi.user.dto.*;
import com.taxi.user.services.GeoLocationService;
import lombok.AllArgsConstructor;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.domain.geo.GeoLocation;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.xml.stream.Location;
import java.util.List;

@Controller
@AllArgsConstructor
public class LocationSocketController {

    private GeoLocationService gls;
    private final SimpMessagingTemplate messagingTemplate;
    private DriverClient driverClient;

    @MessageMapping("/updateLocation")
    @SendTo("/topic/update")
    public LocationUpdate updateLocation(@Payload LocationUpdate locationUpdate) {

        gls.updateUserLocation(locationUpdate.getUserId(),
                            locationUpdate.getLatitude(),
                            locationUpdate.getLongitude());

        return locationUpdate;
    }

    @MessageMapping("/requestRide")
    public void requestRide(@Payload RideRequest rideRequest) {
        List<Long> nearbyDrivers = gls.findNearbyDrivers(rideRequest.getLatitude(), rideRequest.getLongitude(), 5.0);

        for (Long driverId : nearbyDrivers) {
            if (driverClient.getStatusByUserId(driverId).equals("FREE")) {
                messagingTemplate.convertAndSend("/topic/driver-" + driverId, rideRequest);
                gls.storeRideRequest(rideRequest);
            }
        }
    }

    @MessageMapping("/offerRide")
    public void offerRide(@Payload RideOffer rideOffer) {
        gls.storeRideOffer(rideOffer);
        messagingTemplate.convertAndSend("/topic/user-" + rideOffer.getUserId(), rideOffer);
    }

    @MessageMapping("/acceptRide")
    public void acceptRide(@Payload RideAccepted rideAccepted) {
        System.out.println("User " + rideAccepted.getDriverId() + " accepted ride from Driver " + rideAccepted.getDriverId());
        System.out.println(rideAccepted.getDriverId());
        gls.storeRideAccepted(rideAccepted);
        messagingTemplate.convertAndSend("/topic/remove-driver", rideAccepted.getDriverId());

        messagingTemplate.convertAndSend("/topic/remove-user", rideAccepted);
    }
}
