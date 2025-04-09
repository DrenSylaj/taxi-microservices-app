package com.taxi.user.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxi.user.clients.DriverClient;
import com.taxi.user.dto.*;
import com.taxi.user.entities.Role;
import com.taxi.user.repository.UserRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.*;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.*;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GeoLocationService {

    private static final String LOCATION_KEY = "user_locations";
    private static final String RIDE_REQUESTS_KEY = "ride_requests";
    private static final String RIDE_OFFERS_KEY = "ride_offers";
    private static final String RIDE_ACCEPTED_KEY = "ride_accepted";

    private final UserRepository userRepository;
    private final DriverClient driverClient;
    private final HashOperations<String, String, String> hashOps;
    private final GeoOperations<String, String> geoOps;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ListOperations<String, String> listOps;
    private RedisTemplate<String, String> redisTemplate;

    public void updateUserLocation(Long userId, double latitude, double longitude) {
        Point point = new Point(longitude, latitude);
        geoOps.add(LOCATION_KEY, point, userId.toString());
    }

    public List<Long> findNearbyDrivers(double latitude, double longitude, double radiusKm) {
        Point center = new Point(longitude, latitude);
        Circle searchArea = new Circle(center, new Distance(radiusKm, Metrics.KILOMETERS));


        return geoOps.radius(LOCATION_KEY, searchArea, RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs())
                .getContent()
                .stream()
                .map(result -> Long.valueOf(result.getContent().getName()))
                .filter(userId -> isDriver(userId, Role.DRIVER))
                .collect(Collectors.toList());
    }

    public List<RideRequest> getNearbyRideRequests(double latitude, double longitude, double radiusKm, Long driverId) {
        Point center = new Point(longitude, latitude);
        Circle area = new Circle(center, new Distance(radiusKm, Metrics.KILOMETERS));

        GeoResults<RedisGeoCommands.GeoLocation<String>> results =
                geoOps.radius(LOCATION_KEY, area, RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs());

        if (results == null || driverClient.getStatusByUserId(driverId).equals("ON_RIDE")) {
            return Collections.emptyList();
        }

        List<RideRequest> rideRequests = new ArrayList<>();

        for (GeoResult<RedisGeoCommands.GeoLocation<String>> result : results.getContent()) {
            String userId = result.getContent().getName();
            String json = hashOps.get(RIDE_REQUESTS_KEY, userId);

            if (json != null) {
                try {
                    RideRequest request = objectMapper.readValue(json, RideRequest.class);
                    rideRequests.add(request);
                } catch (JsonProcessingException e) {
                    System.err.println("Error parsing RideRequest for userId " + userId);
                }
            }
        }

        return rideRequests;
    }


    public List<RideOffer> getRideOffers(Long userId) {
        String userKey = "ride_offers";
        List<String> jsonList = hashOps.values(userKey);
        if (jsonList == null || jsonList.isEmpty())
        {
            return Collections.emptyList();
        }
        List<RideOffer> rideOffers = new ArrayList<>();
        for (String json : jsonList) {
            try {
                RideOffer rideOffer = objectMapper.readValue(json, RideOffer.class);
                if (Objects.equals(rideOffer.getUserId(), userId)) {
                    rideOffers.add(rideOffer);
                }

            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing ride request JSON", e);
            }
        }
        return rideOffers;
    }

    public RideAccepted getCurrentRideDriver(Long driverId) {
        List<String> jsonList = hashOps.values(RIDE_ACCEPTED_KEY);

        if (jsonList == null || jsonList.isEmpty())
            return null;

        for (String json : jsonList) {
            try {
                RideAccepted rideAccepted = objectMapper.readValue(json, RideAccepted.class);
                if (Objects.equals(rideAccepted.getDriverId(), driverId)) {
                    return rideAccepted;
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing rideAccepted JSON", e);
            }
        }

        return null;
    }

    public RideAccepted getCurrentRideUser(Long userId) {
        List<String> jsonList = hashOps.values(RIDE_ACCEPTED_KEY);

        if (jsonList == null || jsonList.isEmpty())
            return null;

        for (String json : jsonList) {
            try {
                RideAccepted rideAccepted = objectMapper.readValue(json, RideAccepted.class);
                if (Objects.equals(rideAccepted.getUserId(), userId)) {
                    return rideAccepted;
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing rideAccepted JSON", e);
            }
        }

        return null;
    }

    private boolean isDriver(Long userId, Role role) {
        return userRepository.existsByIdAndRole(userId, role);
    }

    public Point getUserLocation(Long userId) {
        List<Point> points = geoOps.position(LOCATION_KEY, userId.toString());
        if (points == null || points.isEmpty() || points.get(0) == null) {
            throw new NotFoundException("User location not found for userId: " + userId);
        }
        return points.get(0);
    }

    public void storeRideRequest(RideRequest rideRequest) {
        try {
            hashOps.put(RIDE_REQUESTS_KEY, rideRequest.getUserId().toString(),
                    objectMapper.writeValueAsString(rideRequest));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error storing ride request", e);
        }
    }

    public void storeRideOffer(RideOffer rideOffer) {

        try {
            String rideOfferId = UUID.randomUUID().toString();
            hashOps.put(RIDE_OFFERS_KEY, rideOfferId,
                    objectMapper.writeValueAsString(rideOffer));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error storing ride offer", e);
        }
    }

    public void storeRideAccepted(RideAccepted rideAccepted) {
        try {
            hashOps.put(RIDE_ACCEPTED_KEY, rideAccepted.getUserId().toString(),objectMapper.writeValueAsString(rideAccepted));

            removeDriverOffers(rideAccepted.getDriverId(), rideAccepted.getUserId());
            removeUserRequests(rideAccepted.getUserId());
            driverClient.updateStatusByUserId("ON_RIDE", rideAccepted.getDriverId());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error storing accepted ride", e);
        }
    }

    public void removeDriverOffers(Long driverId, Long userId) {
        Map<String, String> offers = hashOps.entries(RIDE_OFFERS_KEY);

        for (Map.Entry<String, String> entry : offers.entrySet()) {
            String key = entry.getKey();
            String json = entry.getValue();

            try {
                RideOffer offer = objectMapper.readValue(json, RideOffer.class);
                if (Objects.equals(offer.getDriverId(), driverId) || Objects.equals(offer.getUserId(), userId)) {
                    hashOps.delete(RIDE_OFFERS_KEY, key);
                }
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse RideOffer JSON for userId " + userId);
            }
        }
    }


    public void updateStatus(RideAccepted rideAccepted) {
        Map<String, String> rides = hashOps.entries(RIDE_ACCEPTED_KEY);

        for (Map.Entry<String, String> entry : rides.entrySet()) {
            String key = entry.getKey();
            String json = entry.getValue();

            try {
                RideAccepted ride = objectMapper.readValue(json, RideAccepted.class);
                ride.setStatus(rideAccepted.getStatus());
                if (Objects.equals(ride.getUserId(), rideAccepted.getUserId()) &&
                        (rideAccepted.getStatus().equals("CANCELED") || rideAccepted.getStatus().equals("COMPLETED"))) {
                    System.out.println("Ride status of " + rideAccepted + " was changed to " + rideAccepted.getStatus());
                    hashOps.delete(RIDE_ACCEPTED_KEY, key);
                    driverClient.updateStatusByUserId("FREE", rideAccepted.getDriverId());
                } else if (Objects.equals(ride.getUserId(), rideAccepted.getUserId()) && rideAccepted.getStatus().equals("PICKEDUP")) {
                    ride.setStatus("PICKEDUP");
                    hashOps.put(RIDE_ACCEPTED_KEY, key, objectMapper.writeValueAsString(ride));
                }
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse RideAccepted JSON for " + rideAccepted.getUserId());
            }
        }
    }

    public void removeUserRequests(Long userId) {
        hashOps.delete(RIDE_REQUESTS_KEY, userId.toString());

    }


}