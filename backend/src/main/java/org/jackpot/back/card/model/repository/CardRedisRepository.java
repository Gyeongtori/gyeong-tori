package org.jackpot.back.card.model.repository;


import org.jackpot.back.card.model.entity.CardRedis;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface CardRedisRepository extends CrudRepository<CardRedis, Long> {
    Optional<List<CardRedis>> findByNo(int no);
}
