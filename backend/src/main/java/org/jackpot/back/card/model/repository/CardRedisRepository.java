package org.jackpot.back.card.model.repository;


import org.jackpot.back.card.model.entity.CardRedis;
import org.springframework.data.repository.CrudRepository;

public interface CardRedisRepository extends CrudRepository<CardRedis, Long> {
}
