package com.taxi.communication.services;

import com.taxi.communication.repository.ChatRoomRepository;
import com.taxi.communication.room.ChatRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.RecursiveTask;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatrepo;
    public Optional<String> getChatRoomID(String senderID, String recipientID, boolean createNewROowIfNotExists){
        return chatrepo.findBySenderIDAndRecipientID(senderID, recipientID)
                .map(ChatRoom::getChatID)
                .or(() -> {
                    if (createNewROowIfNotExists){
                        var chatID = createChat(senderID, recipientID);
                    }
                    return Optional.empty();
                });
    }

    public String createChat(String senderID, String recipientID){
        return "";
//        var chatID = 
    }
}
