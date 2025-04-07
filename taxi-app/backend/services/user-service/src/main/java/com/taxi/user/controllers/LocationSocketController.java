package com.taxi.user.controllers;

import com.taxi.user.clients.DriverClient;
import com.taxi.user.dto.*;
import com.taxi.user.services.GeoLocationService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class LocationSocketController {

    private GeoLocationService gls;
    private final SimpMessagingTemplate messagingTemplate;
    private DriverClient driverClient;

    /*

    !INFO : driverId osht userId e userave qe e kane rolin DRIVER,
            nuk i referohet driverId's qe asht te driver-service.

     */


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
        gls.storeRideAccepted(rideAccepted);

        messagingTemplate.convertAndSend("/topic/remove-driver", rideAccepted.getDriverId());
        messagingTemplate.convertAndSend("/topic/remove-user", rideAccepted);
    }

    @MessageMapping("/status")
    public void updateStatus(@Payload RideAccepted rideAccepted) {
        gls.updateStatus(rideAccepted);

        messagingTemplate.convertAndSend("/topic/status-"+ rideAccepted.getUserId(), rideAccepted);
        messagingTemplate.convertAndSend("/topic/status-"+ rideAccepted.getDriverId(), rideAccepted);

    }

}
