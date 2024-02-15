package org.jackpot.back.socket.model.service;

import com.corundumstudio.socketio.SocketIOClient;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.socket.model.entity.Message;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocketService {
    /**
     *
     * @param room which room will get the message
     * @param eventName  which event will get the message
     * @param senderClient who is wanting to send a message (except this while sending a message to room)
     * @param message message
     */
    public void sendMessage(String room, String eventName, SocketIOClient senderClient, String message) {
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent(eventName,
                        Message.builder()
                                .message(message)
                                .build()
                );
            }
        }
    }

}
