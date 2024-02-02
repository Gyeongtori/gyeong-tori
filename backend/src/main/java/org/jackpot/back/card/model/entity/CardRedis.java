package org.jackpot.back.card.model.entity;

import lombok.Builder;
import lombok.Getter;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@RedisHash(value = "card_redis", timeToLive = 21600)
public class CardRedis {
    @Id
    private Long number; //카드 번호
    private CulturalHeritage culturalHeritage; //문화재 외래키
    private Integer rating; //등급
    private CardField field; //속성 (공,수,힐)
}
