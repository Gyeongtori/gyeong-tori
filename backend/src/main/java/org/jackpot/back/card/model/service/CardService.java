package org.jackpot.back.card.model.service;

import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;

import java.util.List;

public interface CardService {
    void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest);
    List<ReadCardResponse> readCard(Long userEmail);
}
