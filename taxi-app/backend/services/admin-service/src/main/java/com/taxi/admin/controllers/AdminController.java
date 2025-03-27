package com.taxi.admin.controllers;

import com.taxi.admin.clients.DriverClient;
import com.taxi.admin.clients.UserClient;
import com.taxi.admin.dto.DriverDTO;
import com.taxi.admin.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserClient userClient;
    private final DriverClient driverClient;

    @GetMapping("/user/{id}")
    public UserDTO userById(@PathVariable Long id){
        return userClient.getUserById(id);
    }

    @GetMapping("/user")
    public List<UserDTO> users(){
        return userClient.getUsers();
    }

    @GetMapping("/driver/{id}")
    public DriverDTO driverById(@PathVariable Long id){
        return driverClient.findById(id);
    }

    @GetMapping("/driver")
    public List<DriverDTO> drivers(){
        return driverClient.drivers();
    }

    @DeleteMapping("/user/{id}")
    public void deleteUserById(@PathVariable Long id){
        userClient.deleteUserById(id);
    }
}
