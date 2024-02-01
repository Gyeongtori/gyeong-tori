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
    Optional<Card> findByCulturalHeritageAndRating(CulturalHeritage culturalHeritage, Integer rating);
//    @Query("SELECT new org.jackpot.back.card.dto.ReadCardResponse(ch.name_kr, ch.sido_name, ch.gugun_name, " +
//            "GROUP_CONCAT(new org.jackpot.back.card.dto.CardGradeDto(c.rating, " +
//            "GROUP_CONCAT(new org.jackpot.back.card.dto.HoldingCardDto(hc.card.number, hc.date))))) " +
//            "FROM HoldingCard hc " +
//            "JOIN hc.card c " +
//            "JOIN c.culturalHeritage ch " +
//            "WHERE ch.no = :culturalHeritageNo AND hc.user.id = :userId " +
//            "GROUP BY ch.name_kr, ch.sido_name")
//    @Query("SELECT new org.jackpot.back.card.model.dto.ReadCardResponse(ch.name_kr, ch.sido_name, ch.gugun_name, " +
//        "STRING_AGG(CONCAT(c.rating, ':', hc.card.number, ':', hc.date), ',')) " +
//        "FROM HoldingCard hc " +
//        "JOIN hc.card c " +
//        "JOIN c.culturalHeritage ch " +
//        "WHERE ch.no = :culturalHeritageNo AND hc.user.id = :userId " +
//        "GROUP BY ch.name_kr, ch.sido_name, ch.gugun_name")
//    List<ReadCardResponse> findCardDtoByCulturalHeritageAndUser(Integer culturalHeritageNo, Long userId);
}
