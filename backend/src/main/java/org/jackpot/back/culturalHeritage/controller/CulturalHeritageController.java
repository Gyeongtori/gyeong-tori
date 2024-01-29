package org.jackpot.back.culturalHeritage.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.service.WebClientServiceImpl;
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
    private final WebClientServiceImpl webClientServiceImpl;

    @GetMapping("/list")
    public ResponseEntity getCulturalHeritageList() throws IOException, JDOMException {
        webClientServiceImpl.search();
        return ResponseEntity.ok().body(MessageUtils.success());
    }
}
