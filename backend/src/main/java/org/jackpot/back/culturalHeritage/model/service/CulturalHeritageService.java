package org.jackpot.back.culturalHeritage.model.service;

import org.jackpot.back.culturalHeritage.model.dto.request.GetCulturalHeritageDistanceListRequest;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritageRedis;

import java.util.List;

public interface CulturalHeritageService {
    void redisSave(); //redis 문화재 값 저장
    List<CulturalHeritageRedis> getCulturalHeritageList();
    List<CulturalHeritageRedis> getCulturalHeritageDistanceList(GetCulturalHeritageDistanceListRequest getCulturalHeritageDistanceListRequest); //문화재 조회
}
