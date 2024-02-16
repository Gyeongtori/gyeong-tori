package org.jackpot.back.culturalHeritage.model.service;

import org.jackpot.back.culturalHeritage.model.dto.request.GetCulturalHeritageDistanceListRequest;
import org.jackpot.back.culturalHeritage.model.dto.response.CulturalHeritageRedisDto;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.jackpot.back.global.model.Language;

import java.util.List;

public interface CulturalHeritageService {
    void redisSave(); //redis 문화재 값 저장
    List<CulturalHeritageRedisDto> getCulturalHeritageList(Language language);
    List<CulturalHeritageRedisDto> getCulturalHeritageDistanceList(GetCulturalHeritageDistanceListRequest getCulturalHeritageDistanceListRequest); //문화재 조회
}
