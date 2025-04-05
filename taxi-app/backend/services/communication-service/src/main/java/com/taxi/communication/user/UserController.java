package com.taxi.communication.user;

import com.taxi.communication.client.UserServiceClient;
import com.taxi.communication.dto.UserDTO;
import feign.FeignException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceClient userServiceClient; // Feign client
    private final SimpMessagingTemplate messagingTemplate;
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    // Verify user exists
    @GetMapping("/verify/{userId}")
    public ResponseEntity<?> verifyUser(@PathVariable Long userId) {
        try {
            UserDTO user = userServiceClient.getUserById(userId); // Feign call
            return ResponseEntity.ok(user);
        } catch (FeignException.NotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get online users
    @GetMapping("/online")
    public List<String> getOnlineUsers() {
        return new ArrayList<>(onlineUsers);
    }

    // WebSocket endpoints
    @MessageMapping("/user.connect")
    public void handleUserConnect(@Payload UserConnectRequest request) {
        onlineUsers.add(request.getUserId());
        broadcastOnlineUsers();
    }

    @MessageMapping("/user.disconnect")
    public void handleUserDisconnect(@Payload UserConnectRequest request) {
        onlineUsers.remove(request.getUserId());
        broadcastOnlineUsers();
    }

    private void broadcastOnlineUsers() {
        messagingTemplate.convertAndSend("/topic/users.online", onlineUsers);
    }

    @Data
    public static class UserConnectRequest {
        private String userId;
        private String status;
    }
}