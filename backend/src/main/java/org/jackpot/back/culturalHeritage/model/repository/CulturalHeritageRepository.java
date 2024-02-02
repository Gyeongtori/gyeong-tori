package org.jackpot.back.culturalHeritage.model.repository;

import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturalHeritageRepository extends JpaRepository<CulturalHeritage,Integer> {

}
