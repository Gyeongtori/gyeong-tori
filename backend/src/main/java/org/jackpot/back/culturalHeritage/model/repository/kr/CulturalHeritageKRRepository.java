package org.jackpot.back.culturalHeritage.model.repository.kr;

import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturalHeritageKRRepository extends JpaRepository<CulturalHeritage,Integer> {

}
