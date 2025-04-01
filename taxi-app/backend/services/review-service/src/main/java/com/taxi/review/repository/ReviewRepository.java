package com.taxi.review.repository;

import com.taxi.review.entities.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByDriverId(String driverId);
    List<Review> findByUserId(String UserId);
}
