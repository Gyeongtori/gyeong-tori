package org.jackpot.back.card.model.service;

import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;

public interface CardService {
    void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest);
    ReadCardResponse readCard(Long userEmail);
}
