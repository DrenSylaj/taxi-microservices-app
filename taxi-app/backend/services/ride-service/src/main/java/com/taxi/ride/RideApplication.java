package com.taxi.ride;

import com.taxi.ride.entities.Ride;
import com.taxi.ride.repositories.RideRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableFeignClients
public class RideApplication {

	public static void main(String[] args) {
		SpringApplication.run(RideApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner commandLineRunner(
//			RideRepository rideRepository
//	){
//		return args -> {
//			var ride =
//			Ride.builder()
//					.costumerId(1L)
//					.driverId(1L)
//					.build();
//
//			rideRepository.insert(ride);
//		};
//	}

}
