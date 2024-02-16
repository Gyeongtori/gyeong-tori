package org.jackpot.back.card.model.entity.en;

import lombok.Builder;
import lombok.Getter;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageRedisEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@RedisHash(value = "card_redis_en", timeToLive = -1L)
public class CardRedisEN {
    @Id
    private Long number; //카드 번호
    private CulturalHeritageRedisEN culturalHeritageRedis; //문화재 외래키
    private Integer rating; //등급
    private CardField field; //속성 (공,수,힐)
    private String image; //이미지 주소
}
