package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card,Long> {
    //문화재, 등급으로 카드 찾기
    Optional<Card> findByCulturalHeritageAndRating(CulturalHeritage culturalHeritage, Integer rating);
    //문화재 이름, 종목, 카드 속성으로 조회
    @Query("SELECT c FROM Card c " +
            "JOIN FETCH c.culturalHeritage ch " +
            "WHERE (:nameKr is null OR ch.nameKr LIKE %:nameKr%) " +
            "AND (:division is null OR ch.division = :division) " +
            "AND (:field is null OR c.field = :field)")
    List<Card> searchCard(@Param("nameKr") String nameKr, @Param("division") String division, @Param("field") CardField field);
}
