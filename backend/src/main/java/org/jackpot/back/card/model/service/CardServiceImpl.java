package org.jackpot.back.card.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.card.exception.CardErrorCode;
import org.jackpot.back.card.exception.CardException;
import org.jackpot.back.card.model.dto.request.AddCardToCollectionRequest;
import org.jackpot.back.card.model.dto.request.CardIndividualReadRequest;
import org.jackpot.back.card.model.dto.request.SearchCardRequest;
import org.jackpot.back.card.model.dto.response.*;
import org.jackpot.back.card.model.entity.en.CardEN;
import org.jackpot.back.card.model.entity.en.CardRedisEN;
import org.jackpot.back.card.model.entity.en.HoldingCardEN;
import org.jackpot.back.card.model.entity.kr.Card;
import org.jackpot.back.card.model.entity.kr.CardRedis;
import org.jackpot.back.card.model.entity.kr.HoldingCard;
import org.jackpot.back.card.model.repository.en.CardENRepository;
import org.jackpot.back.card.model.repository.en.CardRedisENRepository;
import org.jackpot.back.card.model.repository.en.HoldingCardENRepository;
import org.jackpot.back.card.model.repository.kr.CardRedisRepository;
import org.jackpot.back.card.model.repository.kr.CardRepository;
import org.jackpot.back.card.model.repository.kr.HoldingCardRepository;
import org.jackpot.back.culturalHeritage.exception.CulturalHeritageErrorCode;
import org.jackpot.back.culturalHeritage.exception.CulturalHeritageException;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageEN;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageRedisEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.en.CulturalHeritageENRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.en.CulturalHeritageENRepository;
import org.jackpot.back.culturalHeritage.model.repository.kr.CulturalHeritageKRRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.kr.CulturalHeritageKRRepository;
import org.jackpot.back.global.model.Language;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.repository.UserRepository;
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
    private final UserRepository userRepository;
    //한국어
    private final CulturalHeritageKRRepository culturalHeritageKRRepository;
    private final CulturalHeritageKRRedisRepository culturalHeritageKRRedisRepository;
    private final CardRepository cardRepository;
    private final CardRedisRepository cardRedisRepository;
    private final HoldingCardRepository holdingCardRepository;
    //영어
    private final CulturalHeritageENRepository culturalHeritageENRepository;
    private final CulturalHeritageENRedisRepository culturalHeritageENRedisRepository;
    private final CardENRepository cardENRepository;
    private final CardRedisENRepository cardRedisENRepository;
    private final HoldingCardENRepository holdingCardENRepository;

    @Override
    public void redisSave() {
        try {
            //문화재 DB 조회
            List<Card> cardList = cardRepository.findAll();
            //DB -> Redis 저장
            for(Card card : cardList){
                Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(card.getCulturalHeritage().getNo());
                CardRedis cardRedis = CardRedis.builder()
                        .number(card.getNumber())
                        .culturalHeritageRedis(culturalHeritageRedis.get())
                        .rating(card.getRating())
                        .field(card.getField())
                        .image(card.getImage())
                        .build();

                cardRedisRepository.save(cardRedis);
            }
            //문화재 DB 조회
            List<CardEN> cardENList = cardENRepository.findAll();
            //DB -> Redis 저장
            for(Card card : cardList){
                Optional<CulturalHeritageRedisEN> culturalHeritageRedisEN = culturalHeritageENRedisRepository.findById(card.getCulturalHeritage().getNo());
                CardRedisEN cardRedisEN = CardRedisEN.builder()
                        .number(card.getNumber())
                        .culturalHeritageRedis(culturalHeritageRedisEN.get())
                        .rating(card.getRating())
                        .field(card.getField())
                        .image(card.getImage())
                        .build();

                cardRedisENRepository.save(cardRedisEN);
            }
        } catch (Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public void addCardToCollection(AddCardToCollectionRequest addCardToCollectionRequest) {
        //랜덤 등급
        int randomRating = (int) (Math.random() * 5) + 1;
        int cardCount=0;
        //사용자 찾기
        Optional<User> findUser = userRepository.findByEmail(addCardToCollectionRequest.getUserEmail());
        try {
            if(addCardToCollectionRequest.getLanguage()== Language.EN) {
                    //문화재 찾기
                    log.debug(addCardToCollectionRequest.toString());
                    Optional<CulturalHeritageEN> findCulturalHeritageEN = culturalHeritageENRepository.findById(Integer.valueOf(addCardToCollectionRequest.getCulturalHeritageId()));
                    //해당 문화재 등급 카드 찾기
                    Optional<CardEN> findCard = cardENRepository.findByCulturalHeritageAndRating(findCulturalHeritageEN.get(), randomRating);
                    //카드 추가
                    holdingCardENRepository.save(
                            HoldingCardEN.builder()
                                    .user(findUser.get())
                                    .card(findCard.get())
                                    .date(LocalDate.now())
                                    .address(addCardToCollectionRequest.getAddress())
                                    .build()
                    );
                    //사용자 등급 확인 및 업데이트
                    cardCount = holdingCardENRepository.getCardCount(findUser.get().getId()); //총 카드 개수
                } else {
                    //문화재 찾기
                    Optional<CulturalHeritage> findCulturalHeritage = culturalHeritageKRRepository.findById(Integer.valueOf(addCardToCollectionRequest.getCulturalHeritageId()));
                    //해당 문화재 등급 카드 찾기
                    Optional<Card> findCard = cardRepository.findByCulturalHeritageAndRating(findCulturalHeritage.get(), randomRating);
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
                    cardCount = holdingCardRepository.getCardCount(findUser.get().getId()); //총 카드 개수
                }
            User user = findUser.get();
            switch (cardCount) {
                case 3:
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
            e.printStackTrace();
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public CardIndividualReadResponse cardIndividualRead(CardIndividualReadRequest cardIndividualReadRequest) {
        if(cardIndividualReadRequest.getLanguage()==Language.EN){
            Optional<CardRedis> cardRedis = cardRedisRepository.findById(cardIndividualReadRequest.getCardNumber());
            return CardIndividualReadResponse.builder()
                    .no(cardRedis.get().getCulturalHeritageRedis().getNo())
                    .culturalHeritageName(cardRedis.get().getCulturalHeritageRedis().getNameKr())
                    .division(cardRedis.get().getCulturalHeritageRedis().getDivision())
                    .sido(cardRedis.get().getCulturalHeritageRedis().getSidoName())
                    .gugun(cardRedis.get().getCulturalHeritageRedis().getGugunName())
                    .content(cardRedis.get().getCulturalHeritageRedis().getContent())
                    .number(cardRedis.get().getNumber())
                    .field(String.valueOf(cardRedis.get().getField()))
                    .rating(cardRedis.get().getRating())
                    .image(cardRedis.get().getImage())
                    .build();
        }else{
            Optional<CardRedisEN> cardRedisEN = cardRedisENRepository.findById(cardIndividualReadRequest.getCardNumber());
            return CardIndividualReadResponse.builder()
                    .no(cardRedisEN.get().getCulturalHeritageRedis().getNo())
                    .culturalHeritageName(cardRedisEN.get().getCulturalHeritageRedis().getNameEn())
                    .division(cardRedisEN.get().getCulturalHeritageRedis().getDivision())
                    .sido(cardRedisEN.get().getCulturalHeritageRedis().getSidoName())
                    .gugun(cardRedisEN.get().getCulturalHeritageRedis().getGugunName())
                    .content(cardRedisEN.get().getCulturalHeritageRedis().getContent())
                    .number(cardRedisEN.get().getNumber())
                    .field(String.valueOf(cardRedisEN.get().getField()))
                    .rating(cardRedisEN.get().getRating())
                    .image(cardRedisEN.get().getImage())
                    .build();
        }
    }

    @Override
    public List<ReadCardResponse> getCardList(String userEmail, Language language) {
        try {
            //사용자 정보 조회
            Optional<User> findUser = userRepository.findByEmail(userEmail);
            List<ReadCardResponse> response = new ArrayList<>();

            if(language==Language.EN){
                //Redis에 저장된 카드 전체 조회
                List<CardRedisEN> cardRedisList = (List<CardRedisEN>) cardRedisENRepository.findAll();
                //카드 리스트 순회
                for(CardRedisEN cardRedis : cardRedisList){
                    if(response.isEmpty()){
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                        ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                .no(culturalHeritageRedis.get().getNo())
                                .have(false)
                                .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                .division(culturalHeritageRedis.get().getDivision())
                                .sido(culturalHeritageRedis.get().getSidoName())
                                .gugun(culturalHeritageRedis.get().getGugunName())
                                .image(culturalHeritageRedis.get().getImageSource())
                                .field(String.valueOf(cardRedis.getField()))
                                .description(culturalHeritageRedis.get().getContent())
                                .build();

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        CardGradeDto cardGradeDto = CardGradeDto.builder()
                                .cardNumber(cardRedis.getNumber())
                                .grade(cardRedis.getRating())
                                .image(cardRedis.getImage())
                                .build();

                        //보유 카드 조회
                        List<HoldingCardEN> holdingCardList = holdingCardENRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                        List<LocalDate> holdingCards = holdingCardENRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                        cardGradeDto.setHoldingCards(holdingCards);
                        //보유하고 있는 경우
                        if(!holdingCardList.isEmpty()){
                            readCardResponse.setHave(true);
                            readCardResponse.setAddress(holdingCardList.get(0).getAddress());
                        }
                        cardGradeDtoList.add(cardGradeDto);
                        readCardResponse=readCardResponse.toBuilder()
                                .gradeCards(cardGradeDtoList)
                                .build();
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
                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(cardRedis.getNumber())
                                    .grade(cardRedis.getRating())
                                    .image(cardRedis.getImage())
                                    .build();
                            List<LocalDate> holdingCards = holdingCardENRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
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
                            //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                            Optional<CulturalHeritageRedisEN> culturalHeritageRedis = culturalHeritageENRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                            ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                    .no(culturalHeritageRedis.get().getNo())
                                    .have(false)
                                    .culturalHeritageName(culturalHeritageRedis.get().getNameEn())
                                    .division(culturalHeritageRedis.get().getDivision())
                                    .sido(culturalHeritageRedis.get().getSidoName())
                                    .gugun(culturalHeritageRedis.get().getGugunName())
                                    .image(culturalHeritageRedis.get().getImageSource())
                                    .field(String.valueOf(cardRedis.getField()))
                                    .description(culturalHeritageRedis.get().getContent())
                                    .build();

                            //카드 정보 삽입
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(cardRedis.getNumber())
                                    .grade(cardRedis.getRating())
                                    .image(cardRedis.getImage())
                                    .build();

                            //보유 카드 조회
                            List<HoldingCardEN> holdingCardList = holdingCardENRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                            List<LocalDate> holdingCards = holdingCardENRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                            cardGradeDto.setHoldingCards(holdingCards);
                            //보유하고 있는 경우
                            if(!holdingCardList.isEmpty()){
                                readCardResponse = readCardResponse.toBuilder()
                                        .have(true)
                                        .address(holdingCardList.get(0).getAddress())
                                        .build();
                            }

                            cardGradeDtoList.add(cardGradeDto);
                            readCardResponse=readCardResponse.toBuilder()
                                    .gradeCards(cardGradeDtoList)
                                    .build();
                            response.add(readCardResponse);
                        }
                    }
                }
            }else{
                //Redis에 저장된 카드 전체 조회
                List<CardRedis> cardRedisList = (List<CardRedis>) cardRedisRepository.findAll();
                //카드 리스트 순회
                for(CardRedis cardRedis : cardRedisList){
                    if(response.isEmpty()){
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                        ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                .no(culturalHeritageRedis.get().getNo())
                                .have(false)
                                .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                .division(culturalHeritageRedis.get().getDivision())
                                .sido(culturalHeritageRedis.get().getSidoName())
                                .gugun(culturalHeritageRedis.get().getGugunName())
                                .image(culturalHeritageRedis.get().getImageSource())
                                .field(String.valueOf(cardRedis.getField()))
                                .description(culturalHeritageRedis.get().getContent())
                                .build();

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        CardGradeDto cardGradeDto = CardGradeDto.builder()
                                .cardNumber(cardRedis.getNumber())
                                .grade(cardRedis.getRating())
                                .image(cardRedis.getImage())
                                .build();

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
                        readCardResponse=readCardResponse.toBuilder()
                                .gradeCards(cardGradeDtoList)
                                .build();
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
                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(cardRedis.getNumber())
                                    .grade(cardRedis.getRating())
                                    .image(cardRedis.getImage())
                                    .build();
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
                            //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                            Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(cardRedis.getCulturalHeritageRedis().getNo());
                            ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                    .no(culturalHeritageRedis.get().getNo())
                                    .have(false)
                                    .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                    .division(culturalHeritageRedis.get().getDivision())
                                    .sido(culturalHeritageRedis.get().getSidoName())
                                    .gugun(culturalHeritageRedis.get().getGugunName())
                                    .image(culturalHeritageRedis.get().getImageSource())
                                    .field(String.valueOf(cardRedis.getField()))
                                    .description(culturalHeritageRedis.get().getContent())
                                    .build();

                            //카드 정보 삽입
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(cardRedis.getNumber())
                                    .grade(cardRedis.getRating())
                                    .image(cardRedis.getImage())
                                    .build();

                            //보유 카드 조회
                            List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                            List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), cardRedis.getNumber());
                            cardGradeDto.setHoldingCards(holdingCards);
                            //보유하고 있는 경우
                            if(!holdingCardList.isEmpty()){
                                readCardResponse = readCardResponse.toBuilder()
                                        .have(true)
                                        .address(holdingCardList.get(0).getAddress())
                                        .build();
                            }

                            cardGradeDtoList.add(cardGradeDto);
                            readCardResponse=readCardResponse.toBuilder()
                                    .gradeCards(cardGradeDtoList)
                                    .build();
                            response.add(readCardResponse);
                        }
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
            List<CardEN> cardENList = null;
            if(searchCardRequest.getLanguage()==Language.EN){ //영어
                switch (searchCardRequest.getSort()) {
                    case 1: //이름 오름차순
                        cardENList = cardENRepository.searchCardSortNameASC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                        break;
                    case 2: //이름 내림차순
                        cardENList = cardENRepository.searchCardSortNameDESC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                        break;
                    case 3: //최신순
                        cardENList = cardENRepository.searchCardSortDate(findUser.get().getId(), searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                        break;
                }
                //카드 리스트 순회
                for(CardEN card : cardENList){
                    if(response.isEmpty()){
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedisEN> culturalHeritageRedis = culturalHeritageENRedisRepository.findById(card.getCulturalHeritage().getNo());
                        ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                .no(culturalHeritageRedis.get().getNo())
                                .have(false)
                                .culturalHeritageName(culturalHeritageRedis.get().getNameEn())
                                .division(culturalHeritageRedis.get().getDivision())
                                .sido(culturalHeritageRedis.get().getSidoName())
                                .gugun(culturalHeritageRedis.get().getGugunName())
                                .image(culturalHeritageRedis.get().getImageSource())
                                .field(String.valueOf(card.getField()))
                                .description(culturalHeritageRedis.get().getContent())
                                .build();

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        List<HoldingCardEN> holdingCardList = holdingCardENRepository.findByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                        List<LocalDate> holdingCards = holdingCardENRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());

                        CardGradeDto cardGradeDto = CardGradeDto.builder()
                                .cardNumber(card.getNumber())
                                .grade(card.getRating())
                                .image(card.getImage())
                                .holdingCards(holdingCards)
                                .build();

                        //보유하고 있는 경우
                        if(!holdingCardList.isEmpty()){
                            readCardResponse = readCardResponse.toBuilder()
                                    .have(true)
                                    .address(holdingCardList.get(0).getAddress())
                                    .build();
                        }

                        cardGradeDtoList.add(cardGradeDto);

                        readCardResponse = readCardResponse.toBuilder()
                                .gradeCards(cardGradeDtoList)
                                .build();

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
                            //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                            Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(card.getCulturalHeritage().getNo());
                            ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                    .no(culturalHeritageRedis.get().getNo())
                                    .have(false)
                                    .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                    .division(culturalHeritageRedis.get().getDivision())
                                    .sido(culturalHeritageRedis.get().getSidoName())
                                    .gugun(culturalHeritageRedis.get().getGugunName())
                                    .image(culturalHeritageRedis.get().getImageSource())
                                    .field(String.valueOf(card.getField()))
                                    .description(culturalHeritageRedis.get().getContent())
                                    .build();

                            //카드 정보 삽입
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                            List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());

                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(card.getNumber())
                                    .grade(card.getRating())
                                    .image(card.getImage())
                                    .holdingCards(holdingCards)
                                    .build();

                            //보유하고 있는 경우
                            if(!holdingCardList.isEmpty()){
                                readCardResponse = readCardResponse.toBuilder()
                                        .have(true)
                                        .address(holdingCardList.get(0).getAddress())
                                        .build();
                            }

                            cardGradeDtoList.add(cardGradeDto);

                            readCardResponse = readCardResponse.toBuilder()
                                    .gradeCards(cardGradeDtoList)
                                    .build();

                            response.add(readCardResponse);
                        }
                    }
                }
            } else { //한국어
                    switch (searchCardRequest.getSort()){
                        case 1 : //이름 오름차순
                            cardList = cardRepository.searchCardSortNameASC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                            break;
                        case 2: //이름 내림차순
                            cardList = cardRepository.searchCardSortNameDESC(searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                            break;
                        case 3: //최신순
                            cardList = cardRepository.searchCardSortDate(findUser.get().getId(), searchCardRequest.getKeyword(), searchCardRequest.getDivision(), searchCardRequest.getField());
                            break;
                    }
                //카드 리스트 순회
                for(Card card : cardList){
                    if(response.isEmpty()){
                        //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                        Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(card.getCulturalHeritage().getNo());
                        ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                .no(culturalHeritageRedis.get().getNo())
                                .have(false)
                                .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                .division(culturalHeritageRedis.get().getDivision())
                                .sido(culturalHeritageRedis.get().getSidoName())
                                .gugun(culturalHeritageRedis.get().getGugunName())
                                .image(culturalHeritageRedis.get().getImageSource())
                                .field(String.valueOf(card.getField()))
                                .description(culturalHeritageRedis.get().getContent())
                                .build();

                        //카드 정보 삽입
                        List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                        CardGradeDto cardGradeDto = CardGradeDto.builder()
                                .cardNumber(card.getNumber())
                                .grade(card.getRating())
                                .image(card.getImage())
                                .build();

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
                            //연관 문화재 찾기 (문화재 정보 삽입, 카드 속성 삽입)
                            Optional<CulturalHeritageRedis> culturalHeritageRedis = culturalHeritageKRRedisRepository.findById(card.getCulturalHeritage().getNo());
                            ReadCardResponse readCardResponse = ReadCardResponse.builder()
                                    .no(culturalHeritageRedis.get().getNo())
                                    .have(false)
                                    .culturalHeritageName(culturalHeritageRedis.get().getNameKr())
                                    .division(culturalHeritageRedis.get().getDivision())
                                    .sido(culturalHeritageRedis.get().getSidoName())
                                    .gugun(culturalHeritageRedis.get().getGugunName())
                                    .image(culturalHeritageRedis.get().getImageSource())
                                    .field(String.valueOf(card.getField()))
                                    .description(culturalHeritageRedis.get().getContent())
                                    .build();

                            //카드 정보 삽입
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            List<HoldingCard> holdingCardList = holdingCardRepository.findByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());
                            List<LocalDate> holdingCards = holdingCardRepository.findDatesByUserIdAndCardNumber(findUser.get().getId(), card.getNumber());

                            CardGradeDto cardGradeDto = CardGradeDto.builder()
                                    .cardNumber(card.getNumber())
                                    .grade(card.getRating())
                                    .image(card.getImage())
                                    .holdingCards(holdingCards)
                                    .build();

                            //보유하고 있는 경우
                            if(!holdingCardList.isEmpty()){
                                readCardResponse = readCardResponse.toBuilder()
                                        .have(true)
                                        .address(holdingCardList.get(0).getAddress())
                                        .build();
                            }

                            cardGradeDtoList.add(cardGradeDto);

                            readCardResponse = readCardResponse.toBuilder()
                                    .gradeCards(cardGradeDtoList)
                                    .build();

                            response.add(readCardResponse);
                        }
                    }
                }
            }

            return response;

        } catch (Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public List<GetCardRankResponse> getCardRank(Language language) {
        try {
            if(language==Language.EN){
                return holdingCardENRepository.getCardRanking();
            }else{
                return holdingCardRepository.getCardRanking();
            }
        } catch(Exception e){
            throw new CardException(TRANSACTION_FAIL);
        }
    }

    @Override
    public HoldingCardListDto getHoldingCardList(User user) {
        //최종 dto에 추가될 목록
        List<HoldingCardDto> holdingCardDtoList = new ArrayList<>();
        List<HoldingCardBaseDto> holdingCardList = null;

        if(user.getLanguage()==Language.EN){//영어
            holdingCardList = holdingCardENRepository.findAllByUserId(user.getId());
            for (HoldingCardBaseDto holdingCard: holdingCardList) {
                //레디스에서 데이터 탐색
                CardRedisEN card=cardRedisENRepository.findById(holdingCard.getCardNumber())
                        .orElseThrow(()-> new CardException(TRANSACTION_FAIL));
                CulturalHeritageRedisEN culturalHeritage=culturalHeritageENRedisRepository.findById(card.getCulturalHeritageRedis().getNo())
                        .orElseThrow(()->new CulturalHeritageException(CulturalHeritageErrorCode.TRANSACTION_FAIL));

                holdingCardDtoList.add(
                        HoldingCardDto.builder()
                                .cardNumber(holdingCard.getCardNumber())
                                .culturalHeritage(culturalHeritage.getNo())
                                .culturalHeritageName(culturalHeritage.getNameEn())
                                .quantity(holdingCard.getQuantity())
                                .grade(card.getRating())
                                .field(card.getField())
                                .build());
            }
        }else{//한국어
            holdingCardList = holdingCardRepository.findAllByUserId(user.getId());
            for (HoldingCardBaseDto holdingCard: holdingCardList) {
                //레디스에서 데이터 탐색
                CardRedis card=cardRedisRepository.findById(holdingCard.getCardNumber())
                        .orElseThrow(()-> new CardException(TRANSACTION_FAIL));
                CulturalHeritageRedis culturalHeritage=culturalHeritageKRRedisRepository.findById(card.getCulturalHeritageRedis().getNo())
                        .orElseThrow(()->new CulturalHeritageException(CulturalHeritageErrorCode.TRANSACTION_FAIL));

                holdingCardDtoList.add(
                        HoldingCardDto.builder()
                                .cardNumber(holdingCard.getCardNumber())
                                .culturalHeritage(culturalHeritage.getNo())
                                .culturalHeritageName(culturalHeritage.getNameKr())
                                .quantity(holdingCard.getQuantity())
                                .grade(card.getRating())
                                .field(card.getField())
                                .build());
            }
        }
        return HoldingCardListDto.builder()
                .holdingCards(holdingCardDtoList)
                .build();
    }


}
