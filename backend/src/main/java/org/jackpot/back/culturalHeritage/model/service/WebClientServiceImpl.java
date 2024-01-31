package org.jackpot.back.culturalHeritage.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRepository;
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
    private final CulturalHeritageRepository culturalHeritageRepository;
    // webClient 기본 설정
    private WebClient webClient =WebClient.builder().baseUrl("https://www.cha.go.kr/").build();
    private int[] category = {11, 12, 13};
    private int no;
    private String ccbaAsno, ccbaMnm1, ccbaMnm2, ccbaCtcd,
            content, ccbaCtcdNm, ccsiName, ccbaKdcd, longitude, latitude,
            imageUrl, ccimDesc, voiceUrl, videoUrl;


    @Override
    public void search() throws IOException, JDOMException {
        for (int i=0; i<category.length; i++){
            //API 호출
            int finalI = i;
            String response =
                    webClient
                            .get()
                            .uri(uriBuilder ->
                                    uriBuilder
                                            .path("cha/SearchKindOpenapiList.do")
                                            .queryParam("pageUnit", 200)
                                            .queryParam("ccbaCtcd", 37)
                                            .queryParam("ccbaLcto", 12)
                                            .queryParam("ccbaKdcd", category[finalI])
                                            .build())
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();

            //XML 파싱
            SAXBuilder saxBuilder = new SAXBuilder();
            Document doc = saxBuilder.build(new StringReader(response));
            Element rootElement  = doc.getRootElement();

            for (Element item : rootElement.getChildren("item")) {
                no = Integer.parseInt(item.getChildText("no")); //고유 키 값
                ccbaAsno = item.getChildText("ccbaAsno"); //관리번호
                ccbaMnm1 = item.getChildText("ccbaMnm1"); //문화재명(국문)
                ccbaMnm2 = item.getChildText("ccbaMnm2"); //문화재명(한자)
                ccbaCtcdNm = item.getChildText("ccbaCtcdNm"); //시도명
                ccsiName = item.getChildText("ccsiName"); //시군구명
                ccbaKdcd = item.getChildText("ccbaKdcd"); //종목코드
                ccbaCtcd = item.getChildText("ccbaCtcd"); //시도코드
                longitude = item.getChildText("longitude"); //경도
                latitude = item.getChildText("latitude"); //위도

                System.out.println(no);

                //다른 API 동시 호출
                detailSearch(ccbaKdcd, ccbaAsno, ccbaCtcd);
                imageSearch(ccbaKdcd, ccbaAsno, ccbaCtcd);
                videoSearch(ccbaKdcd, ccbaAsno, ccbaCtcd);
                voiceSearch(ccbaKdcd, ccbaAsno, ccbaCtcd, "kr");

                // DB에 데이터 저장
                culturalHeritageRepository.save(CulturalHeritage.builder()
                                .no(no)
                                .asno(ccbaAsno)
                                .name_kr(ccbaMnm1)
                                .name_hanja(ccbaMnm2)
                                .content(content)
                                .sido_name(ccbaCtcdNm)
                                .gugun_name(ccsiName)
                                .division(ccbaKdcd)
                                .lng(longitude)
                                .lat(latitude)
                                .image_source(imageUrl)
                                .image_detail(ccimDesc)
                                .narration(voiceUrl)
                                .video_source(videoUrl)
                        .build());
            }

        }
    }

    @Override
    public void detailSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException {
        //API 호출
        String response =
                webClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path("cha/SearchKindOpenapiDt.do")
                                        .queryParam("pageUnit", 200)
                                        .queryParam("ccbaKdcd", ccbaKdcd)
                                        .queryParam("ccbaAsno", ccbaAsno)
                                        .queryParam("ccbaCtcd", ccbaCtcd)
                                        .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

        //XML 파싱
        SAXBuilder saxBuilder = new SAXBuilder();
        Document doc = saxBuilder.build(new StringReader(response));
        Element rootElement  = doc.getRootElement();
        Element item = rootElement.getChild("item");
        content = item.getChildText("content"); //설명
    }

    @Override
    public void imageSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException {
        //API 호출
        String response =
                webClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path("cha/SearchImageOpenapi.do")
                                        .queryParam("pageUnit", 200)
                                        .queryParam("ccbaKdcd", ccbaKdcd)
                                        .queryParam("ccbaAsno", ccbaAsno)
                                        .queryParam("ccbaCtcd", ccbaCtcd)
                                        .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

        //XML 파싱
        SAXBuilder saxBuilder = new SAXBuilder();
        Document doc = saxBuilder.build(new StringReader(response));
        Element rootElement  = doc.getRootElement();
        Element item = rootElement.getChild("item");
        imageUrl = item.getChildText("imageUrl"); //이미지 주소
        ccimDesc = item.getChildText("ccimDesc"); //이미지 설명
    }

    @Override
    public void videoSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException {
        //API 호출
        String response =
                webClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path("cha/SearchVideoOpenapi.do")
                                        .queryParam("pageUnit", 200)
                                        .queryParam("ccbaKdcd", ccbaKdcd)
                                        .queryParam("ccbaAsno", ccbaAsno)
                                        .queryParam("ccbaCtcd", ccbaCtcd)
                                        .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

        //XML 파싱
        SAXBuilder saxBuilder = new SAXBuilder();
        Document doc = saxBuilder.build(new StringReader(response));
        Element rootElement  = doc.getRootElement();
        Element item = rootElement.getChild("item");
        videoUrl = item.getChildText("videoUrl"); //동영상 주소
    }

    @Override
    public void voiceSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd, String ccbaGbn) throws IOException, JDOMException {
        //API 호출
        String response =
                webClient
                        .get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .path("cha/SearchVoiceOpenapi.do")
                                        .queryParam("pageUnit", 200)
                                        .queryParam("ccbaKdcd", ccbaKdcd)
                                        .queryParam("ccbaAsno", ccbaAsno)
                                        .queryParam("ccbaCtcd", ccbaCtcd)
                                        .queryParam("ccbaGbn", ccbaGbn)
                                        .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

        //XML 파싱
        SAXBuilder saxBuilder = new SAXBuilder();
        Document doc = saxBuilder.build(new StringReader(response));
        Element rootElement  = doc.getRootElement();
        Element item = rootElement.getChild("item");
        voiceUrl = item.getChildText("voiceUrl"); //나레이션 주소
    }


}
