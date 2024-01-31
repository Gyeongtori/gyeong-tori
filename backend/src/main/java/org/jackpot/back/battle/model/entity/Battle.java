package org.jackpot.back.battle.model.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.jackpot.back.card.model.entity.Card;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
@RedisHash(value = "battleRoom", timeToLive = 60 * 60 * 2)
public class Battle implements Serializable {
    @Id
    public Long id;
    public Long playerOneId;
    public Long playerTwoId;
    public Card playerOneBetCard;
    public Card playerTwoBetCard;
    public List<Card> playerOneCardList;
    public List<Card> playerTwoCardList;
}
