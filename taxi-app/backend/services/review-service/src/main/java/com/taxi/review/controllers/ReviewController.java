package com.taxi.review.controllers;

import com.taxi.review.entities.Review;
import com.taxi.review.services.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@AllArgsConstructor
public class ReviewController {

    private ReviewService reviewService;

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        return reviewService.addReview(review);
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable String id, @RequestBody Review updatedReview) {
        return reviewService.updateReview(id, updatedReview.getRating(), updatedReview.getComment());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review was deleted successfully!!!");
    }


    @GetMapping("/driver/{driverId}")
    public List<Review> getDriverReviews(@PathVariable String driverId) {
        return reviewService.getReviewsByDriver(driverId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getUserReviews(@PathVariable String userId) {
        return reviewService.getReviewsByUser(userId);
    }

}
