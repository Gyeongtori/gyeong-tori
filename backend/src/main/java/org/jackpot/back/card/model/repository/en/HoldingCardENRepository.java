package org.jackpot.back.card.model.repository.en;

import org.jackpot.back.card.model.dto.response.GetCardRankResponse;
import org.jackpot.back.card.model.dto.response.HoldingCardBaseDto;
import org.jackpot.back.card.model.entity.en.HoldingCardEN;
import org.jackpot.back.card.model.entity.kr.HoldingCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HoldingCardENRepository extends JpaRepository<HoldingCardEN, Long> {
    //보유 카드 조회
    List<HoldingCardEN> findByUserIdAndCardNumber(Long userId, Long cardNumber);

    //사용자, 카드 넘버로 보유 카드 찾기(날짜만 반환)
    @Query("SELECT hc.date FROM HoldingCardEN hc WHERE hc.user.id = :userId AND hc.card.number = :cardNumber")
    List<LocalDate> findDatesByUserIdAndCardNumber(@Param("userId") Long userId, @Param("cardNumber") Long cardNumber);

    //총 보유 카드 개수 정렬
    @Query("SELECT NEW org.jackpot.back.card.model.dto.response.GetCardRankResponse(" +
            "u.profileImage, u.nickname, u.grade, COUNT(hc.card.number)) " +
            "FROM User u " +
            "JOIN HoldingCardEN hc ON u.id = hc.user.id " +
            "GROUP BY u.id, u.profileImage, u.nickname, u.grade " +
            "ORDER BY COUNT(hc.card.number) DESC")
    List<GetCardRankResponse> getCardRanking();

    //보유 카드 개수 조회
    @Query("select count(hc.user.id) from HoldingCardEN hc where hc.user.id=:userId group by hc.user.id")
    Integer getCardCount(@Param("userId") Long userId);

    @Query("SELECT new org.jackpot.back.card.model.dto.response.HoldingCardBaseDto(h.card.number, COUNT(h)) " +
            "FROM HoldingCardEN h JOIN h.user u " +
            "GROUP BY u.id, h.card.number")
    List<HoldingCardBaseDto> findAllByUserId(Long userId);
}
