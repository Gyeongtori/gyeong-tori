package org.jackpot.back.culturalHeritage.model.repository.en;

import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageRedisEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturalHeritageENRedisRepository extends CrudRepository<CulturalHeritageRedisEN,Integer> {
}
