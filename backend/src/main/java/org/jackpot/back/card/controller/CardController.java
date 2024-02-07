package org.jackpot.back.card.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.request.GetCardListRequest;
import org.jackpot.back.card.model.dto.request.SearchCardRequest;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.service.CardService;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.user.model.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/card")
@RequiredArgsConstructor
@Slf4j
public class CardController {
    private final CardService cardService;

    /**
     * 카드 Redis 저장
     * @return
     */
    @GetMapping("/redis_save")
    public ResponseEntity redisSave() {
        cardService.redisSave();
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    /**
     * 카드 수집
     * @param addCardToCollectionRequest
     * @return
     */
    @PostMapping("/add")
    public ResponseEntity addCardToCollection(@AuthenticationPrincipal User user, @RequestBody AddCardToCollectionRequest addCardToCollectionRequest) {
        addCardToCollectionRequest.setUserEmail(user.getEmail());
        cardService.addCardToCollection(addCardToCollectionRequest);
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    /**
     * 카드 조회 (전체, 상세)
     * @param
     * @return List<ReadCardResponse>
     */
    @GetMapping("/list")
    public ResponseEntity getCardList(@RequestBody GetCardListRequest getCardListRequest) {
        return ResponseEntity.ok().body(MessageUtils.success(cardService.getCardList(getCardListRequest.getUserEmail())));
    }


    @PostMapping("/search")
    public ResponseEntity searchCard(@AuthenticationPrincipal User user, @RequestBody SearchCardRequest searchCardRequest) {
        searchCardRequest.setUserEmail(user.getEmail());
        return ResponseEntity.ok().body(MessageUtils.success(cardService.searchCard(searchCardRequest)));
    }

    /**
     * 카드 랭킹
     * @return List<GetCardRankResponse>
     */
    @GetMapping("/rank")
    public ResponseEntity getCardRank() {
        return ResponseEntity.ok().body(MessageUtils.success(cardService.getCardRank()));
    }
}
