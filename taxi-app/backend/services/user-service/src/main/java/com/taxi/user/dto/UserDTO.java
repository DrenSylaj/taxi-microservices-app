package com.taxi.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDTO {

    @NotBlank(message = "The firstName can't be blank")
    @Size(min = 2, max = 50, message = "The firstName should be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "The lastName can't be blank")
    @Size(min = 2, max = 50, message = "The lastName should be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "The email can't be blank")
    @Email(message = "Please provide a correct email format")
    @Size(max = 100, message = "The email can't be bigger than 100 characters")
    private String email;

    @NotBlank(message = "The password field can't be blank")
    @Size(min = 8, max = 40, message = "The password should be between 8 and 40 characters")
    private String password;

    @Past(message = "The birthdate must be in the past")
    private LocalDate birthDate;

    private String phoneNumber;

    private boolean gender;

    private String city;

    private String address;

}
