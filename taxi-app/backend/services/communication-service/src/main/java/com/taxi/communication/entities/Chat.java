package com.taxi.communication.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "chat")
public class Chat {

    @Id
    private String id;
    private Long udhetimiId;
    private List<Message> messages = new ArrayList<>();

    public Chat(Long udhetimiId) {
        this.udhetimiId = udhetimiId;
    }

    // Getters and Setters
}
