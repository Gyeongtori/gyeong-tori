package org.jackpot.back.dummy.controller;

import lombok.RequiredArgsConstructor;
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
