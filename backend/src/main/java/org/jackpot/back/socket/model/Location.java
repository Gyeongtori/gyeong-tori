package org.jackpot.back.socket.model;

import jakarta.persistence.Entity;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    private String lng;
    private String lat;
    private String nickname;
    private Long userId;
}
