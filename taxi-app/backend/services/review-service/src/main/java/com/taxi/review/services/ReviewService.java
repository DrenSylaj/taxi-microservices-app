package com.taxi.review.services;


import com.taxi.review.clients.DriverClient;
import com.taxi.review.clients.UserClient;
import com.taxi.review.dto.DriverDTO;
import com.taxi.review.dto.UserDTO;
import com.taxi.review.entities.Review;
import com.taxi.review.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReviewService {

    private ReviewRepository reviewRepository;
    private DriverClient driverClient;
    private UserClient userClient;

    public Review addReview(Review review) {
        DriverDTO driver = driverClient.getDriverById(Long.valueOf(review.getDriverId()));
        UserDTO user = userClient.getUserById(Long.valueOf(review.getUserId()));

        if (user == null || driver == null)
            throw new RuntimeException("The Driver or the User does not exist!!!");

        return reviewRepository.save(review);
    }

    public Review updateReview(String id, int rating, String comment) {
        Optional<Review> optionalReview = reviewRepository.findById(id);

        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            review.setRating(rating);
            review.setComment(comment);
            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review was not found!!!!");
        }
    }

    public void deleteReview(String id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
        } else {
            throw new RuntimeException("Review not found");
        }
    }

    public List<Review> getReviewsByDriver(String driverId) {
        return reviewRepository.findByDriverId(driverId);
    }

    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId);
    }
}
