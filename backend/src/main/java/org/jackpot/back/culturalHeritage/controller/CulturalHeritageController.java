package org.jackpot.back.culturalHeritage.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.service.CulturalHeritageService;
import org.jackpot.back.culturalHeritage.model.service.WebClientService;
import org.jackpot.back.global.utils.MessageUtils;
import org.jdom2.JDOMException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/v1/culturalheritage")
@RequiredArgsConstructor
@Slf4j
public class CulturalHeritageController {
    private final WebClientService webClientService;
    private final CulturalHeritageService culturalHeritageService;

    @GetMapping("/list")
    public ResponseEntity getCulturalHeritageList() throws IOException, JDOMException {
        webClientService.search();
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    @GetMapping("/redis_save")
    public ResponseEntity redisSave(){
        culturalHeritageService.redisSave();
        return ResponseEntity.ok().body(MessageUtils.success());
    }
}
