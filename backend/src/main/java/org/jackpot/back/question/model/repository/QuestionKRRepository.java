package org.jackpot.back.question.model.repository;

import org.jackpot.back.question.model.entity.QuestionKR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionKRRepository extends JpaRepository<QuestionKR,Long> {
    @Query("SELECT q FROM QuestionKR q JOIN FETCH q.card WHERE q.id IN :ids")
        //join fetch는 lazy loading으로 n+1 대안
    Optional<List<QuestionKR>> findByIds(@Param("ids") List<Long> idList);
}
