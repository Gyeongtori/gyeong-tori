package org.jackpot.back.card.model.repository.en;



import org.jackpot.back.card.model.entity.en.CardRedisEN;
import org.jackpot.back.card.model.entity.kr.CardRedis;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CardRedisENRepository extends CrudRepository<CardRedisEN, Long> {
    List<CardRedisEN> findByCulturalHeritage_No(int culturalHeritageNo);
    // 카드 검색 (이름, 종목, 속성) - QueryDSL
    @Query("SELECT c FROM CardEN c WHERE (:name is null OR c.culturalHeritage.nameEn LIKE %:name%) " +
            "AND (:division is null OR c.culturalHeritage.division = :division) " +
            "AND (:field is null OR c.field = :field)")
    List<CardRedisEN> searchCard(@Param("name") String name, @Param("division") int division, @Param("field") String field);

    //카드 검색 (이름, 종목, 속성) - 메소드 이름
    List<CardRedisEN> findByCulturalHeritage_NameEnContainingAndCulturalHeritage_DivisionAndField(
            @Param("name") String name, @Param("division") int division, @Param("field") String field);
}
