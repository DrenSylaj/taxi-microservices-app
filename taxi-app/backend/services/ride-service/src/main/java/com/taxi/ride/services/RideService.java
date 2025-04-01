package com.taxi.ride.services;

import com.taxi.ride.clients.DriverClient;
import com.taxi.ride.clients.UserClient;
import com.taxi.ride.dto.RideDto;
import com.taxi.ride.dto.UserDto;
import com.taxi.ride.entities.Ride;
import com.taxi.ride.entities.Status;
import com.taxi.ride.exceptions.InvalidStatusTransitionException;
import com.taxi.ride.exceptions.RideNotFoundException;
import com.taxi.ride.repositories.RideRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {
    private final RideRepository rideRepository;
    private final UserClient userClient;
    private final DriverClient driverClient;

    public UserDto getUserById(Long userId){
        return userClient.getUserById(userId);
    }

    public Ride getRideById(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RideNotFoundException("Ride not found with ID: " + rideId));
    }

    public List<RideDto> getAllRides() {
        return rideRepository.findAll()
                .stream()
                .map(ride -> {
                    UserDto customer = getUserById(ride.getCustomerId());
                    UserDto rider = getUserById(ride.getDriverId());

                    return new RideDto(
                            ride.getCustomerId(),
                            ride.getDriverId(),
                            customer.getFirstName(),
                            customer.getLastName(),
                            rider.getFirstName(),
                            rider.getLastName(),
                            ride.getStatus(),
                            ride.getTimeRequested(),
                            ride.getTimeAccepted(),
                            ride.getTimeArrived(),
                            ride.getTimeCancelled(),
                            ride.getTimeStarted(),
                            ride.getTimeCompleted(),
                            ride.getStartLatitude(),
                            ride.getStartLongitude(),
                            ride.getEndLatitude(),
                            ride.getEndLongitude(),
                            ride.getDistance()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Ride createRide(@Valid RideDto ride){
        var ride1 = Ride.builder()
                .customerId(ride.getCustomerId())
                .driverId(ride.getDriverId())
                .status(ride.getStatus())
                .timeRequested(ride.getTimeRequested())
                .timeAccepted(ride.getTimeAccepted())
                .timeStarted(ride.getTimeStarted())
                .timeArrived(ride.getTimeArrived())
                .timeCancelled(ride.getTimeCancelled())
                .timeCompleted(ride.getTimeCompleted())
                .startLatitude(ride.getStartLatitude())
                .startLongitude(ride.getStartLongitude())
                .endLatitude(ride.getEndLatitude())
                .endLongitude(ride.getEndLongitude())
                .distance(ride.getDistance())
                .build();

        return rideRepository.save(ride1);
    }

    public void deleteRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RideNotFoundException("Ride not found with ID: " + rideId));

        rideRepository.delete(ride);
    }

    @Transactional
    public Ride updateRide(@Valid RideDto rideDto, Long rideId){
        if(rideDto == null){
            throw new IllegalArgumentException("Input cannot be null");
        }

        var ride = rideRepository.findById(rideId).orElseThrow(() -> new RideNotFoundException("Ride not found with id: "+rideId));

        ride.setCustomerId(rideDto.getCustomerId());
        ride.setDriverId(rideDto.getDriverId());
        ride.setStatus(rideDto.getStatus());
        ride.setTimeRequested(rideDto.getTimeRequested());
        ride.setTimeAccepted(rideDto.getTimeAccepted());
        ride.setTimeStarted(rideDto.getTimeStarted());
        ride.setTimeArrived(rideDto.getTimeArrived());
        ride.setTimeCancelled(rideDto.getTimeCancelled());
        ride.setTimeCompleted(rideDto.getTimeCompleted());
        ride.setStartLatitude(rideDto.getStartLatitude());
        ride.setStartLongitude(rideDto.getStartLongitude());
        ride.setEndLatitude(rideDto.getEndLatitude());
        ride.setEndLongitude(rideDto.getEndLongitude());
        ride.setDistance(rideDto.getDistance());


        return rideRepository.save(ride);

    }

    private static final Map<Status, Set<Status>> ALLOWED_TRANSITIONS = Map.of(
            Status.REQUESTED, Set.of(Status.ACCEPTED, Status.CANCELLED),
            Status.ACCEPTED, Set.of(Status.ARRIVED, Status.CANCELLED),
            Status.ARRIVED, Set.of(Status.STARTED, Status.CANCELLED),
            Status.STARTED, Set.of(Status.COMPLETED, Status.CANCELLED),
            Status.COMPLETED, Set.of(),
            Status.CANCELLED, Set.of()
    );

    @Transactional
    public Ride updateStatus(Status status, Long rideId) {

        var ride = rideRepository.findById(rideId).orElseThrow(() -> new RideNotFoundException("Ride not found with id: "+rideId));



        if(!ALLOWED_TRANSITIONS.getOrDefault(ride.getStatus(), Set.of()).contains(status)){
            throw new InvalidStatusTransitionException(
                    "Invalid transition from "+ride.getStatus()+" to "+status
            );
        }

        switch (status){
            case ACCEPTED -> {
                ride.setTimeAccepted(LocalDateTime.now());
                driverClient.updateStatus("ONRIDE", ride.getDriverId());
            }
            case STARTED -> ride.setTimeStarted(LocalDateTime.now());
            case ARRIVED -> ride.setTimeArrived(LocalDateTime.now());
            case CANCELLED -> {
                ride.setTimeCancelled(LocalDateTime.now());
                driverClient.updateStatus("FREE", ride.getDriverId());
            }
            case COMPLETED -> {
                ride.setTimeCompleted(LocalDateTime.now());
                driverClient.updateStatus("FREE", ride.getDriverId());
            }
        }

        ride.setStatus(status);

        return rideRepository.save(ride);
    }

}
