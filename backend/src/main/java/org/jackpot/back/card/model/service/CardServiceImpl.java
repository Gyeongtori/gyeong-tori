package org.jackpot.back.card.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.response.CardGradeDto;
import org.jackpot.back.card.model.dto.response.HoldingCardDto;
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
        //사용자 정보 조회
        Optional<User> findUser = userRepository.findByEmail(userEmail);
        
        List<ReadCardResponse> response = new ArrayList<>();

        //Redis에 저장된 카드 전체 조회
        List<CardRedis> cardRedisList = (List<CardRedis>) cardRedisRepository.findAll();
        //카드 리스트 순회
        for(CardRedis cardRedis : cardRedisList){
            if(response.isEmpty()){
                ReadCardResponse readCardResponse = new ReadCardResponse();
                //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(cardRedis.getCulturalHeritage().getNo());
                readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getName_kr());
                readCardResponse.setSido(culturalHeritageRedis.get().getSido_name());
                readCardResponse.setGugun(culturalHeritageRedis.get().getGugun_name());
                readCardResponse.setImage(culturalHeritageRedis.get().getImage_source());
                readCardResponse.setField(String.valueOf(cardRedis.getField()));
                readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                //카드 정보 삽입
                List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                CardGradeDto cardGradeDto = new CardGradeDto();
                cardGradeDto.setCardNumber(cardRedis.getNumber());
                cardGradeDto.setGrade(cardRedis.getRating());
                
                //보유 카드 조회
                List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                List<Date> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                cardGradeDto.setHoldingCards(holdingCards);
                if(!holdingCardList.isEmpty()){
                    readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                }

                cardGradeDtoList.add(cardGradeDto);
                readCardResponse.setGradeCards(cardGradeDtoList);
                response.add(readCardResponse);
            }
            else {
                Optional<ReadCardResponse> findCardRes = response.stream()
                        .filter(readCardResponse -> readCardResponse.getNo().equals(cardRedis.getCulturalHeritage().getNo()))
                        .findFirst();

                //문화재 정보 존재할 경우
                if(findCardRes.isPresent()) {
                    List<CardGradeDto> findCardGradeDto = findCardRes.get().getGradeCards();
                    //카드 정보 삽입
                    CardGradeDto cardGradeDto = new CardGradeDto();
                    cardGradeDto.setCardNumber(cardRedis.getNumber());
                    cardGradeDto.setGrade(cardRedis.getRating());
                    List<Date> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                    cardGradeDto.setHoldingCards(holdingCards);

                    //리스트에 추가
                    findCardGradeDto.add(cardGradeDto);
                    findCardRes.get().setGradeCards(findCardGradeDto);
                }
                else{
                    ReadCardResponse readCardResponse = new ReadCardResponse();
                    //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                    Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(cardRedis.getCulturalHeritage().getNo());
                    readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                    readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getName_kr());
                    readCardResponse.setSido(culturalHeritageRedis.get().getSido_name());
                    readCardResponse.setGugun(culturalHeritageRedis.get().getGugun_name());
                    readCardResponse.setImage(culturalHeritageRedis.get().getImage_source());
                    readCardResponse.setField(String.valueOf(cardRedis.getField()));
                    readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                    //카드 정보 삽입
                    List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                    CardGradeDto cardGradeDto = new CardGradeDto();
                    cardGradeDto.setCardNumber(cardRedis.getNumber());
                    cardGradeDto.setGrade(cardRedis.getRating());

                    //보유 카드 조회
                    List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                    List<Date> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                    cardGradeDto.setHoldingCards(holdingCards);
                    if(!holdingCardList.isEmpty()){
                        readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                    }

                    cardGradeDtoList.add(cardGradeDto);
                    readCardResponse.setGradeCards(cardGradeDtoList);
                    response.add(readCardResponse);
                }
            }
        }


        return response;
    }
}
