package org.jackpot.back.culturalHeritage.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.service.CulturalHeritageService;
import org.jackpot.back.culturalHeritage.model.service.WebClientService;
import org.jackpot.back.global.utils.MessageUtils;
import org.jdom2.JDOMException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/v1/culturalheritage")
@RequiredArgsConstructor
@Slf4j
public class CulturalHeritageController {
    private final WebClientService webClientService;
    private final CulturalHeritageService culturalHeritageService;

    @GetMapping("/oepn_api")
    public ResponseEntity getCulturalHeritageOpenApi() throws IOException, JDOMException {
        webClientService.search();
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    @GetMapping("/list")
    public ResponseEntity getCulturalHeritageList() {
        List<CulturalHeritage> culturalHeritageList = culturalHeritageService.getList();
        return ResponseEntity.ok().body(MessageUtils.success(culturalHeritageList));
    }

    @GetMapping("/redis_save")
    public ResponseEntity redisSave(){
        culturalHeritageService.redisSave();
        return ResponseEntity.ok().body(MessageUtils.success());
    }
}
