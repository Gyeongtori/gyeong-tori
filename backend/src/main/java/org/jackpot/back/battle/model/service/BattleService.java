package org.jackpot.back.battle.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.battle.repository.BattleRepository;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class BattleService {
    private BattleRepository battleRepository;

    public String createBattleRoom(){
        return "";
    }
}
