package com.taxi.driver.services;

import com.taxi.driver.clients.UserClient;
import com.taxi.driver.dto.DriverDTO;
import com.taxi.driver.dto.UserDTO;
import com.taxi.driver.entities.Driver;
import com.taxi.driver.entities.DriverStatus;
import com.taxi.driver.exceptions.ConflictException;
import com.taxi.driver.repository.DriverRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository repository;
    private final UserClient userClient;


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

        Driver driver = Driver.builder()
                .userId(driverDTO.getUserId())
                .licenseNumber(driverDTO.getLicenseNumber())
                .vehicleModel(driverDTO.getVehicleModel())
                .vehiclePlate(driverDTO.getVehiclePlate())
                .vehicleYear(driverDTO.getVehicleYear())
                .vehicleColor(driverDTO.getVehicleColor())
                .status(DriverStatus.OFFLINE)
                .build();

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
    public Optional<Driver> updateDriver(Long id, DriverDTO updatedDriver) {
        return repository.findById(id)
                .map(driver -> {
                    driver.setLicenseNumber(updatedDriver.getLicenseNumber());
                    driver.setVehicleModel(updatedDriver.getVehicleModel());
                    driver.setVehiclePlate(updatedDriver.getVehiclePlate());
                    driver.setVehicleColor(updatedDriver.getVehicleColor());
                    driver.setVehicleYear(updatedDriver.getVehicleYear());
                    return repository.save(driver);
                });
    }


    public void deleteDriverById(long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        }
    }
}
