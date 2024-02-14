package org.jackpot.back.battle.model.entity;

import lombok.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash(value = "battle_room",timeToLive = 86400)
@Data
@Builder
public class Battle {
    private static final int ROOM_CODE_LENGTH = 10;

    @Id
    private String code;
    private Long player_one_bet;
    private Long player_two_bet;
    public static Battle create(final Long groupId)  {
        String code = RandomStringUtils.randomAlphanumeric(ROOM_CODE_LENGTH);
        return Battle.builder()
                .code(code)
                .build();
    }

}