package org.jackpot.back.card.model.repository;



import org.jackpot.back.card.model.entity.CardRedis;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CardRedisRepository extends CrudRepository<CardRedis, Long> {
    List<CardRedis> findByCulturalHeritage_No(int culturalHeritageNo);
    // 카드 검색 (이름, 종목, 속성) - QueryDSL
    @Query("SELECT c FROM CardRedis c WHERE (:name is null OR c.culturalHeritage.nameKr LIKE %:name%) " +
            "AND (:division is null OR c.culturalHeritage.division = :division) " +
            "AND (:field is null OR c.field = :field)")
    List<CardRedis> searchCard(@Param("name") String name, @Param("division") int division, @Param("field") String field);

    //카드 검색 (이름, 종목, 속성) - 메소드 이름
    List<CardRedis> findByCulturalHeritage_NameKrContainingAndCulturalHeritage_DivisionAndField(
            @Param("name") String name, @Param("division") int division, @Param("field") String field);
}
