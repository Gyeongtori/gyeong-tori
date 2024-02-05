package org.jackpot.back.socket.model;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.socket.model.entity.Location;
import org.jackpot.back.socket.model.entity.Message;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Slf4j
@Component
public class SocketModule {

    private final SocketIOServer server;

    public SocketModule(SocketIOServer server) {
        this.server = server;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());

        server.addEventListener("send_location", Location.class, onLocationReceived());
        server.addEventListener("send_message", Message.class, onMessageReceived());


    }

    private DataListener<Location> onLocationReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== chatchat =========");
            log.info(data.toString());
            data.setSocketId(senderClient.getSessionId().toString());
            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_location", data);
        };
    }

    private DataListener<Message> onMessageReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== battle =========");
            log.info(data.toString());
            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_message", data);

        };
    }

    private ConnectListener onConnected() {
        return (client) -> {
            var params = client.getHandshakeData().getUrlParams();
            if(params.containsKey("room")) {
                String room = params.get("room").stream().collect(Collectors.joining());
                String username = params.get("username").stream().collect(Collectors.joining());
                client.joinRoom(room);
                log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to chat module through", client.getSessionId().toString(), room, username);
            }else{
                log.info("Socket ID[{}]  Connected to socket", client.getSessionId().toString());
            }
        };

    }

    private DisconnectListener onDisconnected() {
        return client -> {
            var params = client.getHandshakeData().getUrlParams();
            if(params.containsKey("room")) {
                String room = params.get("room").stream().collect(Collectors.joining());
                String username = params.get("username").stream().collect(Collectors.joining());
                log.info("Socket ID[{}] - room[{}] - username [{}]  disconnected to chat module through", client.getSessionId().toString(), room, username);
            }else {
                log.info("Client[{}] - Disconnected from socket", client.getSessionId().toString());
            }
        };
    }

}