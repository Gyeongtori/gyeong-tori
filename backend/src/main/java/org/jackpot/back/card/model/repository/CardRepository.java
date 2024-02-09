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

    //문화재 이름, 종목, 카드 속성으로 조회 (문화재 이름 오름차순 정렬)
    @Query("SELECT c FROM Card c " +
            "JOIN FETCH c.culturalHeritage ch " +
            "WHERE (:nameKr is null OR ch.nameKr LIKE %:nameKr%) " +
            "AND (:division is null OR ch.division = :division) " +
            "AND (:field is null OR c.field = :field)" +
            "ORDER BY ch.nameKr ASC")
    List<Card> searchCardSortNameASC(@Param("nameKr") String nameKr, @Param("division") String division, @Param("field") CardField field);

    //문화재 이름, 종목, 카드 속성으로 조회 (문화재 이름 내림차순 정렬)
    @Query("SELECT c FROM Card c " +
            "JOIN FETCH c.culturalHeritage ch " +
            "WHERE (:nameKr is null OR ch.nameKr LIKE %:nameKr%) " +
            "AND (:division is null OR ch.division = :division) " +
            "AND (:field is null OR c.field = :field)" +
            "ORDER BY ch.nameKr DESC")
    List<Card> searchCardSortNameDESC(@Param("nameKr") String nameKr, @Param("division") String division, @Param("field") CardField field);

    @Query("SELECT DISTINCT c FROM Card c " +
            "LEFT JOIN HoldingCard ch ON c.number = ch.card.number " +
            "LEFT JOIN CulturalHeritage chs ON c.culturalHeritage.no = chs.no " +
            "WHERE " +
            "  ( ch.user.id = :userId " +
            "    AND (:nameKr IS NULL OR chs.nameKr LIKE :nameKr) " +
            "    AND (:division IS NULL OR chs.division = :division) " +
            "    AND (:field IS NULL OR c.field = :field) " +
            "  )\n" +
            "ORDER BY ch.date DESC")
    List<Card> searchCardSortDate(@Param("userId") Long userId, @Param("nameKr") String nameKr, @Param("division") String division, @Param("field") CardField field);
}
