package org.jackpot.back.card.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.card.model.entity.HoldingCard;
import org.jackpot.back.card.model.repository.CardRepository;
import org.jackpot.back.card.model.repository.HoldingCardRepository;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRepository;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class CardServiceImpl implements CardService{
    private final CulturalHeritageRepository culturalHeritageRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final HoldingCardRepository holdingCardRepository;

    @Override
    public void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest) {
        //랜덤 등급
        int randomRating = (int) (Math.random() * 5) + 1;
        //문화재 찾기
        Optional<CulturalHeritage> findCulturalHeritage = culturalHeritageRepository.findById(addCardToCollectionRequest.getCulturalHeritageId());
        //해당 문화재 등급 카드 찾기
        Optional<Card> findCard = cardRepository.findByCulturalHeritageAndRating(findCulturalHeritage.get(), randomRating);
        //사용자 찾기
        Optional<User> findUser = userRepository.findByEmail(addCardToCollectionRequest.getUserEmail());
        //카드 추가
        holdingCardRepository.save(
                HoldingCard.builder()
                        .user(findUser.get())
                        .card(findCard.get())
                        .date(new Date())
                        .build()
        );
    }

    @Override
    public List<ReadCardResponse> readCard(Long userEmail) {
        //카드 전체 조회
        //보유 중 카드 조회
        return null;
    }
}
