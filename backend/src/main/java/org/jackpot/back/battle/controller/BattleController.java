package org.jackpot.back.battle.controller;

import org.jackpot.back.global.utils.MessageUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/battle")
public class BattleController {
    @GetMapping("/create")
    public ResponseEntity createRoom(){
        return ResponseEntity.ok(MessageUtils.success());
    }
}
