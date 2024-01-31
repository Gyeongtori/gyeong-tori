package org.jackpot.back.card.model.service;

import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;

public interface CardService {
    void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest);
}
