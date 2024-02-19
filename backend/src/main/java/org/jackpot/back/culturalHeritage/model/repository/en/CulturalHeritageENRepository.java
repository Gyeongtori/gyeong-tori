package org.jackpot.back.culturalHeritage.model.repository.en;

import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturalHeritageENRepository extends JpaRepository<CulturalHeritageEN,Integer> {

}
