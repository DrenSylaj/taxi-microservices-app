package com.taxi.admin.clients;

import com.taxi.admin.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserClient {
    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable Long id);

    @GetMapping
    List<UserDTO> getUsers();

    @DeleteMapping("/{id}")
    void deleteUserById(@PathVariable Long id);

}
