package com.taxi.driver.clients;

import com.taxi.driver.dto.UserDTO;
import lombok.Getter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="user-service", url="${user-service.url}")
public interface UserClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable Long id);

    @PutMapping("/role/{id}")
    void updateRole(@RequestBody String role, @PathVariable Long id);
}
