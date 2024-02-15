package org.jackpot.back.card.model.repository.en;

import org.jackpot.back.card.model.entity.en.CardEN;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.card.model.entity.kr.Card;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardENRepository extends JpaRepository<CardEN,Long> {
    //문화재, 등급으로 카드 찾기
    Optional<CardEN> findByCulturalHeritageAndRating(CulturalHeritageEN culturalHeritage, Integer rating);

    //문화재 이름, 종목, 카드 속성으로 조회 (문화재 이름 오름차순 정렬)
    @Query("SELECT c FROM CardEN c " +
            "JOIN FETCH c.culturalHeritage ch " +
            "WHERE (:nameEn is null OR ch.nameEn LIKE %:nameEn%) " +
            "AND (:division is null OR ch.division = :division) " +
            "AND (:field is null OR c.field = :field)" +
            "ORDER BY ch.nameEn ASC")
    List<Card> searchCardSortNameASC(@Param("nameEn") String nameEn, @Param("division") String division, @Param("field") CardField field);

    //문화재 이름, 종목, 카드 속성으로 조회 (문화재 이름 내림차순 정렬)
    @Query("SELECT c FROM CardEN c " +
            "JOIN FETCH c.culturalHeritage ch " +
            "WHERE (:nameEn is null OR ch.nameEn LIKE %:nameEn%) " +
            "AND (:division is null OR ch.division = :division) " +
            "AND (:field is null OR c.field = :field)" +
            "ORDER BY ch.nameEn DESC")
    List<Card> searchCardSortNameDESC(@Param("nameEn") String nameEn, @Param("division") String division, @Param("field") CardField field);

    @Query("SELECT DISTINCT c FROM CardEN c " +
            "LEFT JOIN HoldingCardEN ch ON c.number = ch.card.number " +
            "LEFT JOIN CulturalHeritageEN chs ON c.culturalHeritage.no = chs.no " +
            "WHERE " +
            "  ( ch.user.id = :userId " +
            "    AND (:nameEn IS NULL OR chs.nameEn LIKE :nameEn) " +
            "    AND (:division IS NULL OR chs.division = :division) " +
            "    AND (:field IS NULL OR c.field = :field) " +
            "  )\n" +
            "ORDER BY ch.date DESC")
    List<Card> searchCardSortDate(@Param("userId") Long userId, @Param("nameEn") String nameEn, @Param("division") String division, @Param("field") CardField field);
}
