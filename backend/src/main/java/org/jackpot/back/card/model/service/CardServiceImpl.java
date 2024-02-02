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
        //날짜 포맷
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        //사용자 아이디 조회
        Optional<User> findUser = userRepository.findByEmail(userEmail);
        //사용자가 존재할 경우
        if (findUser.isPresent()) {
            System.out.println("존재!!!!!!!!!!!");
            //카드 Redis 전체 조회
            List<CardRedis> cardRedisList = (List<CardRedis>) cardRedisRepository.findAll();
            //카드가 존재할 경우
            if(!cardRedisList.isEmpty()){
                //응답 리스트 생성
                List<ReadCardResponse> readCardResponseList = new ArrayList<>();
                //카드 리스트 개별 조회
                for(CardRedis cardRedis : cardRedisList){
                    Optional<ReadCardResponse> findCardRes = readCardResponseList.stream()
                            .filter(readCardResponse -> readCardResponse.getNo().equals(cardRedis.getCulturalHeritage().getNo()))
                            .findFirst();

                    //이미 저장된 문화재일 경우
                    if(findCardRes.isPresent()){
                        //해당 카드를 사용자가 보유하고 있는지 카드 DB 조회 (card_number, user_email)
                        Optional<List<HoldingCard>> holdingCardList = holdingCardRepository.findByUser_IdAndCard_Number(findUser.get().getId(), cardRedis.getNumber());
                        //보유하고 있을 경우
                        if(holdingCardList.isPresent()){
                            //상세 주소 추가
                            findCardRes.get().setAddress(holdingCardList.get().get(0).getAddress());
                            //보유카드 수집일 조회
                            List<String> dateList = new ArrayList<>();
                            //수집일 추가
                            for(HoldingCard holdingCard : holdingCardList.get()){
                                dateList.add(format.format(holdingCard.getDate()));
                            }
                            //grade_cards 가져와서 현재 카드 정보 추가하기
                            List<CardGradeDto> findCardGradeDtoList = findCardRes.get().getGradeCards();
                            findCardGradeDtoList.add(new CardGradeDto(cardRedis.getNumber(), cardRedis.getRating(), dateList));
                        }
                        //보유하고 있지 않을 경우
                        else {
                            //상세 주소 없음
                            findCardRes.get().setAddress(null);
                            //grade_cards 가져와서 현재 카드 정보 추가하기
                            List<CardGradeDto> findCardGradeDtoList = findCardRes.get().getGradeCards();
                            findCardGradeDtoList.add(new CardGradeDto(cardRedis.getNumber(), cardRedis.getRating(), null));
                        }
                    }
                    //아직 저장되지 않은 문화재일 경우
                    else {
                        ReadCardResponse readCardResponse = new ReadCardResponse();
                        //카드 외래키로 문화재 정보 삽입
                        readCardResponse.setCulturalHeritageName(cardRedis.getCulturalHeritage().getName_kr()); //이름
                        readCardResponse.setSido(cardRedis.getCulturalHeritage().getSido_name()); //시도
                        readCardResponse.setGugun(cardRedis.getCulturalHeritage().getGugun_name()); //군구
                        readCardResponse.setImage(cardRedis.getCulturalHeritage().getImage_source()); //이미지 주소
                        readCardResponse.setField(String.valueOf(cardRedis.getField())); //속성
                        readCardResponse.setDescription(cardRedis.getCulturalHeritage().getContent()); //설명

                        //해당 카드를 사용자가 보유하고 있는지 카드 DB 조회 (card_number, user_email)
                        Optional<List<HoldingCard>> holdingCardList = holdingCardRepository.findByUser_IdAndCard_Number(findUser.get().getId(), cardRedis.getNumber());
                        //보유하고 있을 경우
                        if(holdingCardList.isPresent()){
                            //상세 주소 추가
                            readCardResponse.setAddress(holdingCardList.get().get(0).getAddress());
                            //보유카드 수집일 조회
                            List<String> dateList = new ArrayList<>();
                            //수집일 추가
                            for(HoldingCard holdingCard : holdingCardList.get()){
                                dateList.add(format.format(holdingCard.getDate()));
                            }
                            //grade_cards 생성해서 현재 카드 정보 추가하기
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            cardGradeDtoList.add(new CardGradeDto(cardRedis.getNumber(), cardRedis.getRating(), dateList));
                        }
                        //보유하고 있지 않을 경우
                        else {
                            //상세 주소 없음
                            readCardResponse.setAddress(null);
                            //grade_cards 생성해서 현재 카드 정보 추가하기
                            List<CardGradeDto> cardGradeDtoList = new ArrayList<>();
                            cardGradeDtoList.add(new CardGradeDto(cardRedis.getNumber(), cardRedis.getRating(), null));
                        }
                        readCardResponseList.add(readCardResponse);
                    }

                }
                return readCardResponseList;
            }

        }


        return null;
    }
}
