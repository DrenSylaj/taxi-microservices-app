package com.taxi.ride.repositories;

import com.taxi.ride.entities.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RideRepository extends MongoRepository<Ride, String> {
}
