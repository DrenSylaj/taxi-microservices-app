package com.taxi.driver.services;

import com.taxi.driver.clients.UserClient;
import com.taxi.driver.dto.DriverDTO;
import com.taxi.driver.dto.UserDTO;
import com.taxi.driver.dto.VerificationDTO;
import com.taxi.driver.entities.*;
import com.taxi.driver.exceptions.ConflictException;
import com.taxi.driver.exceptions.VerificationApprovedException;
import com.taxi.driver.repository.CarRepository;
import com.taxi.driver.repository.DriverRepository;
import com.taxi.driver.repository.VerificationRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository repository;
    private final CarRepository carRepository;
    private final UserClient userClient;
    private final VerificationService verificationService;
    private final VerificationRepository verificationRepository;


    public Driver getDriverById(long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Cannot find the user with id: "+id));
    }

    @Transactional
    public Driver createDriver(@Valid DriverDTO driverDTO) {
        UserDTO user = userClient.getUserById(driverDTO.getUserId());


        if (user == null) {
            throw new NotFoundException("User with that id is not Found!");
        }
        if (repository.findByUserId(driverDTO.getUserId()) != null) {
            throw new ConflictException("Driver with this user ID already exists!");
        }


        Car car = Car.builder()
                .model(driverDTO.getCarModel())
                .plateNumber(driverDTO.getCarPlate())
                .year(driverDTO.getCarYear())
                .color(driverDTO.getCarColor())
                .build();
        car = carRepository.save(car);

        Driver driver = Driver.builder()
                .userId(driverDTO.getUserId())
                .licenseNumber(driverDTO.getLicenseNumber())
                .status(DriverStatus.OFFLINE)
                .car(car)
                .build();

        userClient.updateRole("DRIVER", user.getId());

        return repository.save(driver);
    }

    @Transactional
    public Optional<Driver> updateStatus(String status, Long id){
        var driver = getDriverById(id);
        DriverStatus status1 = DriverStatus.valueOf(status.toUpperCase().trim());
        driver.setStatus(status1);

        return Optional.of(repository.save(driver));
    }

    @Transactional
    public void applyForDriver(@Valid VerificationDTO verificationDTO){
        UserDTO user = userClient.getUserById(verificationDTO.getUserId());


        if (user == null) {
            throw new NotFoundException("User with that id is not Found!");
        }
        if (verificationRepository.findByUserId(verificationDTO.getUserId()) != null) {
            throw new ConflictException("Verification with this user ID already exists!");
        }


        userClient.updateRole("POTENTIAL_DRIVER", verificationDTO.getUserId());

        var verification = Verification.builder()
                .userId(verificationDTO.getUserId())
                .adminId(verificationDTO.getAdminId())
                .timeRequested(LocalDateTime.now())
                .status(VerificationStatus.REQUESTED)
                .build();

        verificationService.createVerification(verification);

        var car = Car.builder()
                .color(verificationDTO.getColor())
                .year(verificationDTO.getYear())
                .userId(verificationDTO.getUserId())
                .numberOfSeats(verificationDTO.getNumberOfSeats())
                .plateNumber(verificationDTO.getPlateNumber())
                .model(verificationDTO.getModel())
                .build();

        carRepository.save(car);
    }

    private Car getCarForUser(Long userId) {
        return carRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Car not found for user: " + userId));
    }

    @Transactional
    public Driver approveVerification(Long verificationId){
        var verification = verificationService.approveVerification(verificationId);
        var car = getCarForUser(verification.getUserId());



        var driver = Driver.builder()
                .car(car)
                .licenseNumber(verification.getLicenseNumber())
                .userId(verification.getUserId())
                .status(DriverStatus.OFFLINE)
                .build();

        userClient.updateRole("DRIVER", verification.getUserId());



        return repository.save(driver);
    }


    public Verification rejectVerification(Long verificationId){

        return verificationService.refuseVerification(verificationId);
    }

    @Transactional
    public Optional<Driver> updateDriver(Long id, DriverDTO updatedDriver) {
        return repository.findById(id)
                .map(driver -> {
                    driver.setLicenseNumber(updatedDriver.getLicenseNumber());
                    Car car = driver.getCar();
                    car.setModel(updatedDriver.getCarModel());
                    car.setPlateNumber(updatedDriver.getCarPlate());
                    car.setYear(updatedDriver.getCarYear());
                    car.setColor(updatedDriver.getCarColor());

                    carRepository.save(car);
                    return repository.save(driver);
                });
    }


    public void deleteDriverById(long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        }
    }
}
