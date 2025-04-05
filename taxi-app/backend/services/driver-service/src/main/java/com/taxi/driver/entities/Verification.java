package com.taxi.driver.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Verification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String licenseNumber;
    @Enumerated(EnumType.STRING)
    private VerificationStatus status = VerificationStatus.REQUESTED;
    private Long adminId;
    private LocalDateTime timeRequested = LocalDateTime.now();
    private LocalDateTime timeUpdated;
}
