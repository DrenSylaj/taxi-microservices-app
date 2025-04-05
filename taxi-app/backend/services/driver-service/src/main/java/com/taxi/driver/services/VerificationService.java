package com.taxi.driver.services;

import com.taxi.driver.entities.Verification;
import com.taxi.driver.entities.VerificationStatus;
import com.taxi.driver.exceptions.VerificationApprovedException;
import com.taxi.driver.repository.VerificationRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class VerificationService {
    private final VerificationRepository verificationRepository;

    public Verification findVerificationById(Long id){
        return verificationRepository.findById(id).orElseThrow(() -> new NotFoundException("Verification not found with id "+id));
    }

    public void createVerification(Verification verification){
        if(verification == null){
            throw new RuntimeException("Null objects not allowed");
        }

        verificationRepository.save(verification);
    }

    public Verification approveVerification(Long verificationId){
        var verification = findVerificationById(verificationId);

        if(!verification.getStatus().equals(VerificationStatus.REQUESTED)){
            throw new VerificationApprovedException("Verification is already checked");
        }

        verification.setStatus(VerificationStatus.APPROVED);
        verification.setTimeUpdated(LocalDateTime.now());

        return verificationRepository.save(verification);
    }

    public Verification refuseVerification(Long verificationId){
        var verification = findVerificationById(verificationId);

        if(!verification.getStatus().equals(VerificationStatus.REQUESTED)){
            throw new VerificationApprovedException("Verification is already checked");
        }

        verification.setStatus(VerificationStatus.REJECTED);
        verification.setTimeUpdated(LocalDateTime.now());


        return verificationRepository.save(verification);
    }
}
