package org.jackpot.back.card.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.CardGradeDto;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.card.model.entity.CardRedis;
import org.jackpot.back.card.model.entity.HoldingCard;
import org.jackpot.back.card.model.repository.CardRedisRepository;
import org.jackpot.back.card.model.repository.CardRepository;
import org.jackpot.back.card.model.repository.HoldingCardRepository;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRepository;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class CardServiceImpl implements CardService{
    private final CulturalHeritageRepository culturalHeritageRepository;
    private final CulturalHeritageRedisRepository culturalHeritageRedisRepository;
    private final CardRepository cardRepository;
    private final CardRedisRepository cardRedisRepository;
    private final UserRepository userRepository;
    private final HoldingCardRepository holdingCardRepository;

    @Override
    public void redisSave() {
        //문화재 DB 조회
        List<Card> cardList = cardRepository.findAll();
        //DB -> Redis 저장
        for(Card card : cardList){
            CardRedis cardRedis = CardRedis.builder()
                    .number(card.getNumber())
                    .culturalHeritage(card.getCulturalHeritage())
                    .rating(card.getRating())
                    .field(card.getField())
                    .build();
            cardRedisRepository.save(cardRedis);
        }
    }

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
                        .address(addCardToCollectionRequest.getAddress())
                        .build()
        );
    }

    @Override
    public List<ReadCardResponse> getCardList(String userEmail) {
        List<ReadCardResponse> readCardResponseList = new ArrayList<>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

        //문화재 전체 조회
        List<CulturalHeritageRedis> culturalHeritageRedisList = (List<CulturalHeritageRedis>) culturalHeritageRedisRepository.findAll();
        for(CulturalHeritageRedis culturalHeritageRedis : culturalHeritageRedisList){
            //문화재에 해당하는 카드 조회
            Optional<List<CardRedis>> optionalCardRedisList = cardRedisRepository.findByCulturalHeritage_No(culturalHeritageRedis.getNo());
            //카드가 존재할 경우
            if(optionalCardRedisList.get() != null) {
                ReadCardResponse readCardResponse = new ReadCardResponse();
                readCardResponse.setCulturalHeritageName(culturalHeritageRedis.getName_kr());
                readCardResponse.setSido(culturalHeritageRedis.getSido_name());
                readCardResponse.setGugun(culturalHeritageRedis.getGugun_name());
                readCardResponse.setImage(culturalHeritageRedis.getImage_source());
                readCardResponse.setDescription(culturalHeritageRedis.getContent());

                List<CardRedis> cardRedisList = optionalCardRedisList.get(); //카드 리스트
                List<CardGradeDto> cardGradeDtoList = new ArrayList<>(); //응답 DTO
                //카드 리스트 각각 조회
                for(CardRedis cardRedis: cardRedisList){
                    CardGradeDto cardGradeDto = new CardGradeDto();
                    cardGradeDto.setCardNumber(cardRedis.getNumber());
                    cardGradeDto.setGrade(cardRedis.getRating());
                    //사용자 ID, 카드 번호로 보유하고 있는 카드 조회
                    Optional<User> findUser = userRepository.findByEmail(userEmail);
                    Optional<List<HoldingCard>> optionalHoldingCardList = holdingCardRepository.findByUser_IdAndCard_Number(findUser.get().getId(), cardRedis.getNumber());
                    List<HoldingCard> holdingCardList = optionalHoldingCardList.get();
                    //보유한 카드 수집일 리스트
                    List<String> holdingCards = new ArrayList<>();
                    //사용자가 해당 카드를 보유했을 경우
                    if(holdingCardList != null){
                        //주소 set
                        readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                        //카드 수집일 리스트 set
                        for(HoldingCard holdingCard : holdingCardList){
                            holdingCards.add(format.format(holdingCard.getDate()));
                        }
                        cardGradeDto.setHoldingCards(holdingCards);
                    }
                    else {
                        readCardResponse.setAddress(null);
                        cardGradeDto.setHoldingCards(holdingCards);
                    }
                    //등급별로 조회한 결과 add
                    cardGradeDtoList.add(cardGradeDto);
                }
                readCardResponse.setGradeCards(cardGradeDtoList);
            }
        }

        return readCardResponseList;
    }
}
