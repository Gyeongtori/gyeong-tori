package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card,Long> {
    Optional<Card> findByCulturalHeritageAndRating(CulturalHeritage culturalHeritage, Integer rating);
}
