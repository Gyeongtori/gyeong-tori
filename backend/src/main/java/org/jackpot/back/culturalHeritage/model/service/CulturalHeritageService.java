package org.jackpot.back.culturalHeritage.model.service;

import org.jackpot.back.culturalHeritage.model.dto.request.GetCulturalHeritageListRequest;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritageRedis;

import java.util.List;

public interface CulturalHeritageService {
    void redisSave(); //redis 문화재 값 저장
    List<CulturalHeritageRedis> getList(GetCulturalHeritageListRequest getCulturalHeritageListRequest);
}
