package org.jackpot.back.dummy.controller;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.card.model.dto.response.CardGradeDto;
import org.jackpot.back.card.model.dto.response.HoldingCardDto;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;
import org.jackpot.back.dummy.dto.request.DummyGetCardListRequest;
import org.jackpot.back.dummy.dto.response.Card;
import org.jackpot.back.dummy.dto.response.DummyCardList;
import org.jackpot.back.global.utils.MessageUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/v1/dummy")
@RequiredArgsConstructor
public class DummyCardController {
     @PostMapping("/list")
     public ResponseEntity dummyList(@RequestBody DummyGetCardListRequest dummyGetCardListRequest){
         List<HoldingCardDto> holdingCardDtoList1 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList2 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList4 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList6 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList7 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList8 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList9 = new ArrayList<>();
         List<HoldingCardDto> holdingCardDtoList10 = new ArrayList<>();

         holdingCardDtoList1.add(new HoldingCardDto(1L, "2024-01-01"));
         holdingCardDtoList1.add(new HoldingCardDto(1L, "2024-01-02"));
         holdingCardDtoList1.add(new HoldingCardDto(1L, "2024-01-03"));
         holdingCardDtoList2.add(new HoldingCardDto(2L, "2024-01-04"));
         holdingCardDtoList2.add(new HoldingCardDto(2L, "2024-01-05"));
         holdingCardDtoList4.add(new HoldingCardDto(4L, "2024-01-06"));
         holdingCardDtoList6.add(new HoldingCardDto(6L, "2024-01-07"));
         holdingCardDtoList6.add(new HoldingCardDto(6L, "2024-01-08"));
         holdingCardDtoList6.add(new HoldingCardDto(6L, "2024-01-09"));
         holdingCardDtoList7.add(new HoldingCardDto(7L, "2024-01-10"));
         holdingCardDtoList7.add(new HoldingCardDto(7L, "2024-01-11"));
         holdingCardDtoList8.add(new HoldingCardDto(8L, "2024-01-12"));
         holdingCardDtoList9.add(new HoldingCardDto(9L, "2024-01-13"));
         holdingCardDtoList10.add(new HoldingCardDto(10L, "2024-01-14"));

         List<CardGradeDto> cardGradeDtoList1 = new ArrayList<>();
         List<CardGradeDto> cardGradeDtoList2 = new ArrayList<>();

         cardGradeDtoList1.add(new CardGradeDto(1, holdingCardDtoList1));
         cardGradeDtoList1.add(new CardGradeDto(2, holdingCardDtoList2));
         cardGradeDtoList1.add(new CardGradeDto(3, null));
         cardGradeDtoList1.add(new CardGradeDto(4, holdingCardDtoList4));
         cardGradeDtoList1.add(new CardGradeDto(5, null));
         cardGradeDtoList2.add(new CardGradeDto(1, holdingCardDtoList6));
         cardGradeDtoList2.add(new CardGradeDto(2, holdingCardDtoList7));
         cardGradeDtoList2.add(new CardGradeDto(3, holdingCardDtoList8));
         cardGradeDtoList2.add(new CardGradeDto(4, holdingCardDtoList9));
         cardGradeDtoList2.add(new CardGradeDto(5, holdingCardDtoList10));

         List<ReadCardResponse> readCardResponseList = new ArrayList<>();
         readCardResponseList.add(new ReadCardResponse("경주 불국사 다보탑", "경북", "경주시", cardGradeDtoList1, "http://www.cha.go.kr/unisearch/images/national_treasure/1612673.jpg", "ATTACK", "불국사는 통일신라 경덕왕 10년(751) 김대성의 발원에 의해 창건된 사찰로, 과거·현재·미래의 부처가 사는 정토(淨土), 즉 이상향을 구현하고자 했던 신라인들의 정신세계가 잘 드러나 있는 곳이다."));
         readCardResponseList.add(new ReadCardResponse("경주 불국사 삼층석탑", "경북", "경주시", cardGradeDtoList2, "http://www.cha.go.kr/unisearch/images/national_treasure/1612742.jpg", "DEFENCE", "불국사는 통일신라 경덕왕 10년(751) 김대성의 발원에 의해 창건된 사찰로, 과거·현재·미래의 부처가 사는 정토(淨土), 즉 이상향을 구현하고자 했던 신라인들의 정신세계가 잘 드러나 있는 곳이다."));

         return ResponseEntity.ok().body(MessageUtils.success(readCardResponseList));
     }

    @PostMapping("/cards")
    public ResponseEntity dummyGetCardList(@RequestBody DummyGetCardListRequest dummyGetCardListRequest){
        List<Card> cardList=new ArrayList<>();
        Integer offset= dummyGetCardListRequest.getOffset();
        String[][] cardData=new String[][]{
                {"1","2024-01-25","노란석굴암","Yellow Seokgulam","1","경주","DEFENCE","card/노란석굴암.png","국보","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"2","2024-01-25","동국","Dongguk","2","경주","ATTACK","card/동국.png","보물","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"3","2024-01-25","불국사","Bulguksa","3","경주","HEAL","card/불국사.png","사적","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"4","2024-01-25","사리장엄구","Sarijangumgu","4","경주","DEFENCE","card/사리장엄구.png","명승","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"5","2024-01-25","산","San","5","경주","ATTACK","card/산.png","국보","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"6","2024-01-25","석굴암","Seokgulam","1","경주","HEAL","card/석굴암.png","보물","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"7","2024-01-25","설산","Seolsan","2","경주","DEFENCE","card/설산.png","사적","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"8","2024-01-25","성덕대왕신종","Seongdeokdaewangsinjong","3","경주","ATTACK","card/성덕대왕신종.png","명승","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"9","2024-01-25","어디지","Eodiji","4","경주","HEAL","card/어디지.png","국보","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"10","2024-01-25","월정교","Weoljeonggyo","5","경주","DEFENCE","card/월정교.png","보물","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."},
                {"11","2024-01-25","첨성대","Cheomseongdae","1","경주","ATTACK","card/첨성대.png","사적","손이라 도스의 요양의 측 국내의 21일 하나를, 반민주적만 색깔을 대한다. 지원하는 기존이 플레이를 것 대비하다. 배제한 데 등 장부의 가진, 있다. 못하는 시즌에서부터 중 공산품은 응답하다. 비자금이 의원도 보장이 접속하다. 있은 꺼릴지 심장병을 도입이라 비효율적을 있다."}
            };
        for (int i=1;i<=11;i++) {
            String[] card=cardData[i-1];
            if(offset<=i&&i<offset+6) {
                cardList.add(
                        Card.builder()
                                .cardId(Integer.parseInt(card[0]))
                                .cardAt(card[1])
                                .nameKr(card[2])
                                .nameEng(card[3])
                                .rating(Integer.parseInt(card[4]))
                                .gugunName(card[5])
                                .field(card[6])
                                .img(card[7])
                                .category(card[8])
                                .description(card[9])
                                .build()
                );
            }
        }
        DummyCardList dummyCardList=new DummyCardList();
        dummyCardList.setOffset(offset);
        dummyCardList.setCurrnet(cardList.size());
        dummyCardList.setCardList(cardList);
        return ResponseEntity.ok().body(MessageUtils.success(dummyCardList));
    }

}
