package com.taxi.communication.repository;

import com.taxi.communication.room.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySenderIDAndRecipientID(Long senderID, Long recipientID);
}
