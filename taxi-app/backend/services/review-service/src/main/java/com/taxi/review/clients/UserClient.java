package com.taxi.review.clients;

import com.taxi.review.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="user-service", url="${user-service.url}")
public interface UserClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable Long id);
}
