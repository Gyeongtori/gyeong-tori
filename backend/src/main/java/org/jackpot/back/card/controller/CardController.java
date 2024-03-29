package org.jackpot.back.card.controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.request.CardIndividualReadRequest;
import org.jackpot.back.card.model.dto.request.SearchCardRequest;
import org.jackpot.back.card.model.service.CardService;
import org.jackpot.back.global.model.Language;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.user.model.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


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
        System.out.println(addCardToCollectionRequest.toString());
        log.debug(addCardToCollectionRequest.toString());
        addCardToCollectionRequest.setUserEmail(user.getEmail());
        addCardToCollectionRequest.setLanguage(user.getLanguage());
        cardService.addCardToCollection(addCardToCollectionRequest);
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    /**
     * 카드 개별 조회
     * @param cardIndividualReadRequest
     * @return CardIndividualReadResponse
     */
    @PostMapping("/read")
    public ResponseEntity cardIndividualRead(@AuthenticationPrincipal User user, @RequestBody CardIndividualReadRequest cardIndividualReadRequest) {
        cardIndividualReadRequest.setLanguage(user.getLanguage());
        return ResponseEntity.ok().body(MessageUtils.success(cardService.cardIndividualRead(cardIndividualReadRequest)));
    }
     @GetMapping("/holding_list")
     public ResponseEntity getHoldingCardList(@AuthenticationPrincipal User user){
        return ResponseEntity.ok().body(MessageUtils.success(cardService.getHoldingCardList(user)));
     }

    /**
     * 카드 조회 (전체, 상세)
     * @param
     * @return List<ReadCardResponse>
     */
    @GetMapping("/list")
    public ResponseEntity getCardList(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok().body(MessageUtils.success(cardService.getCardList(user,user.getLanguage())));
    }

    /**
     * 카드 검색 및 정렬
     * @param searchCardRequest
     * @return List<ReadCardResponse>
     */
    @PostMapping("/search")
    public ResponseEntity searchCard(@AuthenticationPrincipal User user, @RequestBody SearchCardRequest searchCardRequest) {
        searchCardRequest.setUserEmail(user.getEmail());
        searchCardRequest.setLanguage(user.getLanguage());
        return ResponseEntity.ok().body(MessageUtils.success(cardService.searchCard(searchCardRequest)));
    }

    /**
     * 카드 랭킹
     * @return List<GetCardRankResponse>
     */
    @GetMapping("/rank")
    public ResponseEntity getCardRank(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok().body(MessageUtils.success(cardService.getCardRank(user.getLanguage())));
    }
}
