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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/v1/dummy")
@RequiredArgsConstructor
public class DummyCardController {
    /**
     * Dummy 카드 조회
     * @param dummyGetCardListRequest
     * @return
     */
     @PostMapping("/list")
     public ResponseEntity dummyList(@RequestBody DummyGetCardListRequest dummyGetCardListRequest){
         List<ReadCardResponse> readCardResponseList = new ArrayList<>();

         List<CardGradeDto> cardGradeDtoList1 = new ArrayList<>();
         cardGradeDtoList1.add(new CardGradeDto(1L, 1, List.of(
                 LocalDate.parse("2024-01-01"),
                 LocalDate.parse("2024-01-02"),
                 LocalDate.parse("2024-01-03")
         )));
         cardGradeDtoList1.add(new CardGradeDto(2L, 2, List.of(
                 LocalDate.parse("2024-01-02"),
                 LocalDate.parse("2024-01-03")
         )));
         cardGradeDtoList1.add(new CardGradeDto(3L, 3, null));
         cardGradeDtoList1.add(new CardGradeDto(4L, 4, List.of(
                 LocalDate.parse("2024-01-06")
         )));
         cardGradeDtoList1.add(new CardGradeDto(5L, 5, null));
         readCardResponseList.add(new ReadCardResponse(320, true, "경주 불국사 다보탑", "11", "경북", "경주시", "경북 경주시 불국로 385", cardGradeDtoList1,
                 "http://www.cha.go.kr/unisearch/images/national_treasure/1612673.jpg", "ATTACK",
                 "법화경에 의하면 “석가모니가 영취산(靈鷲山)에서 법화경을 설파할 때 다보여래의 진신사리를 모셔둔 탑이 땅 밑에서 솟아나오고, 그 탑 속에서 소리를 내어 석가모니의 설법을 참된 진리라고 찬탄하고 증명하였다”라고 한다. 참고로 석가모니가 자신 다음에 부처가 될것이라 수기(예언)을 내린 부처도 다보불이다. 이를 근원으로 세워진 탑이 다보여래상주증명탑, 줄여서 다보탑이다. 즉 절의 대웅전 마당에 다보탑을 세우는 것은 석가모니의 영취산을 절에서 재현하는 의미다."));

         List<CardGradeDto> cardGradeDtoList2 = new ArrayList<>();
         cardGradeDtoList2.add(new CardGradeDto(6L, 1, List.of(
                 LocalDate.parse("2024-01-01"),
                 LocalDate.parse("2024-01-02"),
                 LocalDate.parse("2024-01-03")
         )));
         cardGradeDtoList2.add(new CardGradeDto(7L, 2, List.of(
                 LocalDate.parse("2024-01-02"),
                 LocalDate.parse("2024-01-03")
         )));
         cardGradeDtoList2.add(new CardGradeDto(8L, 3, List.of(
                 LocalDate.parse("2024-01-11")
         )));
         cardGradeDtoList2.add(new CardGradeDto(9L, 4, List.of(
                 LocalDate.parse("2024-01-06"),
                 LocalDate.parse("2024-01-30")
         )));
         cardGradeDtoList2.add(new CardGradeDto(10L, 5, List.of(
                 LocalDate.parse("2024-01-23")
         )));
         readCardResponseList.add(new ReadCardResponse(321, true, "경주 불국사 삼층석탑", "11", "경북", "경주시", "경북 경주시 불국로 385 불국사", cardGradeDtoList2,
                 "http://www.cha.go.kr/unisearch/images/national_treasure/1612742.jpg", "DEFENCE",
                 "경주 불국사 삼층석탑(慶州佛國寺三層石塔)은 경주 불국사에 있는, 남북국 시대 신라의 삼층석탑이다. 원래 이름은 석가여래상주설법탑(釋迦如來常住設法塔)이며 흔히 줄여서 석가탑(釋迦塔)이라고도 한다. 아사달과 아사녀의 전설에서 따 무영탑(無影塔)이라고 부르기도 한다. 불국사 대웅전 앞뜰에 다보탑과 나란히 서 있으며, 대한민국의 국보 제21호로 지정되어 있다."));


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
