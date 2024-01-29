package org.jackpot.back.culturalHeritage.model.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@Slf4j
public class WebClientService {
    public void get() {
        // webClient 기본 설정
        WebClient webClient =
                WebClient
                        .builder()
                        .baseUrl("https://www.cha.go.kr/")
                        .build();

        // api 요청
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

        // 결과 확인
        log.info("test: " + response.toString());
    }
}
