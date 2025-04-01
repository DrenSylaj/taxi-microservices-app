package com.taxi.communication.room;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatRoom {
    @Id
    private Long id;
    private Long chatID;
    private Long senderID;
    private Long recipientID;
}
