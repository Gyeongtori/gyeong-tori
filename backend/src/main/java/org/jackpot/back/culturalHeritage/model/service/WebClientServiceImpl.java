package org.jackpot.back.culturalHeritage.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.io.StringReader;

@RequiredArgsConstructor
@Service
@Slf4j
public class WebClientServiceImpl implements WebClientService{
    // webClient 기본 설정
    WebClient webClient =
            WebClient
                    .builder()
                    .baseUrl("https://www.cha.go.kr/")
                    .build();

    @Override
    public void search() throws IOException, JDOMException {
        //API 호출
        String response =
                webClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path("cha/SearchKindOpenapiList.do")
                                        .queryParam("ccbaCtcd", 37)
                                        .queryParam("ccbaLcto", 12)
                                        .queryParam("ccbaKdcd", 11)
                                        .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

        //XML 파싱
        SAXBuilder saxBuilder = new SAXBuilder();
        Document doc = saxBuilder.build(new StringReader(response));
        Element rootElement  = doc.getRootElement();

        for (Element item : rootElement.getChildren("item")) {
            String ccbaAsno = item.getChildText("ccbaAsno");
            String ccbaMnm1 = item.getChildText("ccbaMnm1");
            String ccbaMnm2 = item.getChildText("ccbaMnm2");
            String ccbaCtcdNm = item.getChildText("ccbaCtcdNm");
            String ccsiName = item.getChildText("ccsiName");
            String ccbaKdcd = item.getChildText("ccbaKdcd");
            String longitude = item.getChildText("longitude");
            String latitude = item.getChildText("latitude");

            // DB에 데이터 저장
            System.out.println(ccbaAsno+" "+ccbaMnm1);
        }
    }

    @Override
    public void detailSearch() {

    }

    @Override
    public void imageSearch() {

    }

    @Override
    public void videoSearch() {

    }

    @Override
    public void voiceSearch() {

    }
}
