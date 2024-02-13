package org.jackpot.back.socket.model;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.socket.model.entity.Action;
import org.jackpot.back.socket.model.entity.BattleQuestion;
import org.jackpot.back.socket.model.entity.Location;
import org.jackpot.back.socket.model.entity.Message;
import org.springframework.stereotype.Component;

import java.util.UUID;
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
        server.addEventListener("send_question", BattleQuestion.class, onQuestionReceived());
        server.addEventListener("send_action", Action.class, onBattleActionReceived());
    }

    private DataListener<Location> onLocationReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== chatchat =========");
            log.info(data.toString());
            data.setSocketId(senderClient.getSessionId().toString());
            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_location",data);
        };
    }

    private DataListener<Message> onMessageReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== message =========");
            log.info(data.toString());
            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_message", data);
        };
    }
    private DataListener<BattleQuestion> onQuestionReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== question =========");
            log.info(data.toString());
            // 소켓 ID에 해당하는 클라이언트를 찾습니다.
            UUID socketId=UUID.fromString(data.getSocketId());
            SocketIOClient client = server.getClient(socketId);
            if (client != null) {
                // 클라이언트가 존재하면, 해당 클라이언트에게 이벤트를 전송합니다.
                log.info("send get_question event to user {}",socketId);
                client.sendEvent("get_question", data);
            } else {
                // 클라이언트를 찾을 수 없는 경우, 에러 처리나 로깅을 수행할 수 있습니다.
               log.info("Client with socket ID {} not found",socketId);
            }
        };
    }
    private DataListener<Action> onBattleActionReceived() {
        return (senderClient, data, ackSender) -> {
            log.info("======== battle =========");
            log.info(data.toString());
            // 소켓 ID에 해당하는 클라이언트를 찾습니다.
            UUID socketId=UUID.fromString(data.getSocketId());
            SocketIOClient client = server.getClient(socketId);
            if (client != null) {
                // 클라이언트가 존재하면, 해당 클라이언트에게 이벤트를 전송합니다.
                log.info("send get_battle event to user {}",socketId);
                client.sendEvent("get_battle", data);
            } else {
                // 클라이언트를 찾을 수 없는 경우, 에러 처리나 로깅을 수행할 수 있습니다.
               log.info("Client with socket ID {} not found",socketId);
            }
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
