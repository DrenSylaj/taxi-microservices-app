package com.taxi.user.services;

import com.taxi.user.dto.LocationUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.geo.*;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.xml.stream.Location;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeoLocationService {

    private static final String LOCATION_KEY = "user_locations";

    @Autowired
    private GeoOperations<String, String> geoOps;

    private RedisTemplate<String, String> redisTemplate;

    public void updateUserLocation(Long userId, double latitude, double longitude) {
        Point point = new Point(longitude, latitude);
        geoOps.add(LOCATION_KEY, point, userId.toString());
    }

    public List<String> findNearbyUsers(double latitude, double longitude, double radiusKm) {
        Point center = new Point(longitude, latitude);
        Circle circle = new Circle(center, new Distance(radiusKm, Metrics.KILOMETERS));
        return geoOps.radius(LOCATION_KEY, circle, RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs())
                .getContent()
                .stream()
                .map(result -> result.getContent().getName())
                .collect(Collectors.toList());
    }


    public List<LocationUpdate> getAllUsers() {
        double largeRadiusKm = 1000000;

        Point center = new Point(0, 0);
        Circle circle = new Circle(center, new Distance(largeRadiusKm, Metrics.KILOMETERS));

        return geoOps.radius(LOCATION_KEY, circle,
                        RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs().includeCoordinates())
                .getContent()
                .stream()
                .map(result -> {
                    LocationUpdate location = new LocationUpdate();
                    location.setUserId(Long.valueOf(result.getContent().getName()));
                    location.setLongitude(result.getContent().getPoint().getX());
                    location.setLatitude(result.getContent().getPoint().getY());
                    return location;
                })
                .collect(Collectors.toList());
    }

}