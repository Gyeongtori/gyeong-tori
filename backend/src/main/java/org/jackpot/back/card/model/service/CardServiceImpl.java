package org.jackpot.back.card.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.exception.CardException;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.request.SearchCardRequest;
import org.jackpot.back.card.model.dto.response.CardGradeDto;
import org.jackpot.back.card.model.dto.response.GetCardRankResponse;
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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.jackpot.back.card.exception.CardErrorCode.*;

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
        try {
            //문화재 DB 조회
            List<Card> cardList = cardRepository.findAll();
            //DB -> Redis 저장
            for(Card card : cardList){
                Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(card.getCulturalHeritage().getNo());
                CardRedis cardRedis = CardRedis.builder()
                        .number(card.getNumber())
                        .culturalHeritageRedis(culturalHeritageRedis.get())
                        .rating(card.getRating())
                        .field(card.getField())
                        .image(card.getImage())
                        .build();

                cardRedisRepository.save(cardRedis);
            }
        } catch (Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest) {
        //랜덤 등급
        int randomRating = (int) (Math.random() * 5) + 1;
        try {
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
                            .date(LocalDate.now())
                            .address(addCardToCollectionRequest.getAddress())
                            .build()
            );

            //사용자 등급 확인 및 업데이트
            int cardCount = holdingCardRepository.getCardCount(findUser.get().getId()); //총 카드 개수
            User user = findUser.get();
            switch (cardCount) {
                case 3 :
                    user.setGrade(2);
                    userRepository.save(user);
                    break;
                case 5:
                    user.setGrade(3);
                    userRepository.save(user);
                    break;
                case 8:
                    user.setGrade(4);
                    userRepository.save(user);
                    break;
                case 13:
                    user.setGrade(5);
                    userRepository.save(user);
                    break;
                case 20:
                    user.setGrade(6);
                    userRepository.save(user);
                    break;
                case 40:
                    user.setGrade(7);
                    userRepository.save(user);
                    break;
                case 100:
                    user.setGrade(8);
                    userRepository.save(user);
                    break;
            }


        } catch (Exception e) {
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public List<ReadCardResponse> getCardList(String userEmail) {
        try {
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
                    Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                    readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                    readCardResponse.setHave(false);
                    readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getNameKr());
                    readCardResponse.setDivision(culturalHeritageRedis.get().getDivision());
                    readCardResponse.setSido(culturalHeritageRedis.get().getSidoName());
                    readCardResponse.setGugun(culturalHeritageRedis.get().getGugunName());
                    readCardResponse.setImage(culturalHeritageRedis.get().getImageSource());
                    readCardResponse.setField(String.valueOf(cardRedis.getField()));
                    readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                    //카드 정보 삽입
                    List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                    CardGradeDto cardGradeDto = new CardGradeDto();
                    cardGradeDto.setCardNumber(cardRedis.getNumber());
                    cardGradeDto.setGrade(cardRedis.getRating());
                    cardGradeDto.setImage(cardRedis.getImage());

                    //보유 카드 조회
                    List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                    List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                    cardGradeDto.setHoldingCards(holdingCards);
                    //보유하고 있는 경우
                    if(!holdingCardList.isEmpty()){
                        readCardResponse.setHave(true);
                        readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                    }

                    cardGradeDtoList.add(cardGradeDto);
                    readCardResponse.setGradeCards(cardGradeDtoList);
                    response.add(readCardResponse);
                }
                else {
                    Optional<ReadCardResponse> findCardRes = response.stream()
                            .filter(readCardResponse -> readCardResponse.getNo().equals(cardRedis.getCulturalHeritageRedis().getNo()))
                            .findFirst();

                    //문화재 정보 존재할 경우
                    if(findCardRes.isPresent()) {
                        List<CardGradeDto> findCardGradeDto = findCardRes.get().getGradeCards();
                        //카드 정보 삽입
                        CardGradeDto cardGradeDto = new CardGradeDto();
                        cardGradeDto.setCardNumber(cardRedis.getNumber());
                        cardGradeDto.setGrade(cardRedis.getRating());
                        cardGradeDto.setImage(cardRedis.getImage());
                        List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                        //보유하고 있는 경우
                        if(!holdingCards.isEmpty()){
                            findCardRes.get().setHave(true);
                        }
                        cardGradeDto.setHoldingCards(holdingCards);

                        //리스트에 추가
                        findCardGradeDto.add(cardGradeDto);
                        findCardRes.get().setGradeCards(findCardGradeDto);
                    }
                    else{
                        ReadCardResponse readCardResponse = new ReadCardResponse();
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                        readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                        readCardResponse.setHave(false);
                        readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getNameKr());
                        readCardResponse.setDivision(culturalHeritageRedis.get().getDivision());
                        readCardResponse.setSido(culturalHeritageRedis.get().getSidoName());
                        readCardResponse.setGugun(culturalHeritageRedis.get().getGugunName());
                        readCardResponse.setImage(culturalHeritageRedis.get().getImageSource());
                        readCardResponse.setField(String.valueOf(cardRedis.getField()));
                        readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        CardGradeDto cardGradeDto = new CardGradeDto();
                        cardGradeDto.setCardNumber(cardRedis.getNumber());
                        cardGradeDto.setGrade(cardRedis.getRating());
                        cardGradeDto.setImage(cardRedis.getImage());

                        //보유 카드 조회
                        List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                        List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                        cardGradeDto.setHoldingCards(holdingCards);
                        //보유하고 있는 경우
                        if(!holdingCardList.isEmpty()){
                            readCardResponse.setHave(true);
                            readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                        }

                        cardGradeDtoList.add(cardGradeDto);
                        readCardResponse.setGradeCards(cardGradeDtoList);
                        response.add(readCardResponse);
                    }
                }
            }
            return response;

        } catch (Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public List<ReadCardResponse> searchCard(SearchCardRequest searchCardRequest) {
        try {
            //사용자 정보 조회
            Optional<User> findUser = userRepository.findByEmail(searchCardRequest.getUserEmail());

            List<ReadCardResponse> response = new ArrayList<>();

            //카드 조건에 맞게 조회
            List<Card> cardList = null;

            //정렬 조건
            switch (searchCardRequest.getSort()){
                case 1 : //이름 오름차순
                    cardList = cardRepository.searchCardSortNameASC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                    break;
                case 2: //이름 내림차순
                    cardList = cardRepository.searchCardSortNameDESC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                    break;
                case 3: //최신순
                    cardList = cardRepository.searchCardSortDate(findUser.get().getId(), searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());

//                    for(Card card : cardList){
//                        System.out.println("카드: " + card.getCulturalHeritage().getNameKr() + " " + card.getNumber());
//                    }
                    break;

            }

            //카드 리스트 순회
            for(Card card : cardList){
                if(response.isEmpty()){
                    ReadCardResponse readCardResponse = new ReadCardResponse();
                    //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                    Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(card.getCulturalHeritage().getNo());
                    readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                    readCardResponse.setHave(false);
                    readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getNameKr());
                    readCardResponse.setDivision(culturalHeritageRedis.get().getDivision());
                    readCardResponse.setSido(culturalHeritageRedis.get().getSidoName());
                    readCardResponse.setGugun(culturalHeritageRedis.get().getGugunName());
                    readCardResponse.setImage(culturalHeritageRedis.get().getImageSource());
                    readCardResponse.setField(String.valueOf(card.getField()));
                    readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                    //카드 정보 삽입
                    List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                    CardGradeDto cardGradeDto = new CardGradeDto();
                    cardGradeDto.setCardNumber(card.getNumber());
                    cardGradeDto.setGrade(card.getRating());
                    cardGradeDto.setImage(card.getImage());

                    //보유 카드 조회
                    List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                    List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                    cardGradeDto.setHoldingCards(holdingCards);
                    //보유하고 있는 경우
                    if(!holdingCardList.isEmpty()){
                        readCardResponse.setHave(true);
                        readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                    }

                    cardGradeDtoList.add(cardGradeDto);
                    readCardResponse.setGradeCards(cardGradeDtoList);
                    response.add(readCardResponse);
                }
                else {
                    Optional<ReadCardResponse> findCardRes = response.stream()
                            .filter(readCardResponse -> readCardResponse.getNo().equals(card.getCulturalHeritage().getNo()))
                            .findFirst();

                    //문화재 정보 존재할 경우
                    if(findCardRes.isPresent()) {
                        List<CardGradeDto> findCardGradeDto = findCardRes.get().getGradeCards();
                        //카드 정보 삽입
                        CardGradeDto cardGradeDto = new CardGradeDto();
                        cardGradeDto.setCardNumber(card.getNumber());
                        cardGradeDto.setGrade(card.getRating());
                        cardGradeDto.setImage(card.getImage());

                        List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                        //보유하고 있는 경우
                        if(!holdingCards.isEmpty()){
                            findCardRes.get().setHave(true);
                        }
                        cardGradeDto.setHoldingCards(holdingCards);

                        //리스트에 추가
                        findCardGradeDto.add(cardGradeDto);
                        findCardRes.get().setGradeCards(findCardGradeDto);
                    }
                    else{
                        ReadCardResponse readCardResponse = new ReadCardResponse();
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageRedisRepository.findById(card.getCulturalHeritage().getNo());
                        readCardResponse.setNo(culturalHeritageRedis.get().getNo());
                        readCardResponse.setHave(false);
                        readCardResponse.setCulturalHeritageName(culturalHeritageRedis.get().getNameKr());
                        readCardResponse.setDivision(culturalHeritageRedis.get().getDivision());
                        readCardResponse.setSido(culturalHeritageRedis.get().getSidoName());
                        readCardResponse.setGugun(culturalHeritageRedis.get().getGugunName());
                        readCardResponse.setImage(culturalHeritageRedis.get().getImageSource());
                        readCardResponse.setField(String.valueOf(card.getField()));
                        readCardResponse.setDescription(culturalHeritageRedis.get().getContent());

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        CardGradeDto cardGradeDto = new CardGradeDto();
                        cardGradeDto.setCardNumber(card.getNumber());
                        cardGradeDto.setGrade(card.getRating());
                        cardGradeDto.setImage(card.getImage());

                        //보유 카드 조회
                        List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                        List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                        cardGradeDto.setHoldingCards(holdingCards);
                        //보유하고 있는 경우
                        if(!holdingCardList.isEmpty()){
                            readCardResponse.setHave(true);
                            readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                        }

                        cardGradeDtoList.add(cardGradeDto);
                        readCardResponse.setGradeCards(cardGradeDtoList);
                        response.add(readCardResponse);
                    }
                }
            }
            return response;

        } catch (Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public List<GetCardRankResponse> getCardRank() {
        try {
            return holdingCardRepository.getCardRanking();
        } catch(Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }


}
