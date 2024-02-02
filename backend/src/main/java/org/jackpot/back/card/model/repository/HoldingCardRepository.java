package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.entity.HoldingCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoldingCardRepository extends JpaRepository<HoldingCard, Long> {
    //사용자, 카드 넘버로 보유 카드 찾기
    Optional<List<HoldingCard>> findByUser_IdAndCard_Number(Long userId, Long cardNumber);
}
