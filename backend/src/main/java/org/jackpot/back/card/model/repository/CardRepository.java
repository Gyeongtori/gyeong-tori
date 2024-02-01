package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card,Long> {
    //문화재, 등급으로 카드 찾기
    Optional<Card> findByCulturalHeritageAndRating(CulturalHeritage culturalHeritage, Integer rating);
}
