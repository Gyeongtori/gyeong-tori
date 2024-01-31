package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.entity.HoldingCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoldingCardRepository extends JpaRepository<HoldingCard, Long> {
}
