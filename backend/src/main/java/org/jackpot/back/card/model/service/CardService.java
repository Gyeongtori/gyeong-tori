package org.jackpot.back.card.model.service;

import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.request.CardIndividualReadRequest;
import org.jackpot.back.card.model.dto.request.SearchCardRequest;
import org.jackpot.back.card.model.dto.response.CardIndividualReadResponse;
import org.jackpot.back.card.model.dto.response.GetCardRankResponse;
import org.jackpot.back.card.model.dto.response.HoldingCardListDto;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.global.model.Language;
import org.jackpot.back.user.model.entity.User;

import java.util.List;

public interface CardService {
    //카드 redis 저장
    void redisSave();
    //카드 수집
    void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest);
    //카드 개별 조회
    CardIndividualReadResponse cardIndividualRead(CardIndividualReadRequest cardIndividualReadRequest);
    //카드 전체 조회
    List<ReadCardResponse> getCardList(String userEmail, Language language);
    //카드 검색
    List<ReadCardResponse> searchCard(SearchCardRequest searchCardRequest);
    //카드 랭킹
    List<GetCardRankResponse> getCardRank(Language language);

    HoldingCardListDto getHoldingCardList(User user);
}
