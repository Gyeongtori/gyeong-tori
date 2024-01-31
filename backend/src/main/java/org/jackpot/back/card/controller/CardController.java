package org.jackpot.back.card.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.service.CardService;
import org.jackpot.back.global.utils.MessageUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/card")
@RequiredArgsConstructor
@Slf4j
public class CardController {
    private final CardService cardService;

    /**
     * 카드 수집
     * @param addCardToCollectionRequest
     * @return card
     */
    @PostMapping("/add")
    public ResponseEntity addCardToCollection(@RequestBody AddCardToCollectionRequest addCardToCollectionRequest) {
        cardService.addCardToCollection(addCardToCollectionRequest);
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    @PostMapping("/read")
    public ResponseEntity readCard(@RequestBody Long userEmail) {
        ReadCardResponse readCardResponse = cardService.readCard(userEmail);
        return ResponseEntity.ok().body(MessageUtils.success(readCardResponse));
    }
}
