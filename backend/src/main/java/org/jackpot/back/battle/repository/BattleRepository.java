package org.jackpot.back.battle.repository;

import org.jackpot.back.battle.model.entity.Battle;
import org.springframework.data.repository.CrudRepository;

public interface BattleRepository  extends CrudRepository<Battle, Long> {
}
