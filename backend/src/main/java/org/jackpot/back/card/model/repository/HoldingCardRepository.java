package org.jackpot.back.card.model.repository;

import org.jackpot.back.card.model.dto.response.GetCardRankResponse;
import org.jackpot.back.card.model.entity.HoldingCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoldingCardRepository extends JpaRepository<HoldingCard, Long> {
    //보유 카드 조회
    List<HoldingCard> findByUserIdAndCardNumber(Long userId, Long cardNumber);

    //사용자, 카드 넘버로 보유 카드 찾기(날짜만 반환)
    @Query("SELECT hc.date FROM HoldingCard hc WHERE hc.user.id = :userId AND hc.card.number = :cardNumber")
    List<LocalDate> findDatesByUserIdAndCardNumber(@Param("userId") Long userId, @Param("cardNumber") Long cardNumber);

    //보유 카드 총 개수 정렬
//    List<GetCardRankResponse>
}
