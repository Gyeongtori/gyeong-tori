package org.jackpot.back.culturalHeritage.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CulturalHeritageServiceImpl implements CulturalHeritageService{
    private final CulturalHeritageRepository culturalHeritageRepository;
    private final CulturalHeritageRedisRepository culturalHeritageRedisRepository;

    @Override
    public void redisSave() {
        //문화재 DB 조회
        List<CulturalHeritage> culturalHeritageList = culturalHeritageRepository.findAll();
        //DB -> Redis 저장
        for(CulturalHeritage culturalHeritage : culturalHeritageList){
            CulturalHeritageRedis culturalHeritageRedis = CulturalHeritageRedis.builder()
                    .no(culturalHeritage.getNo())
                    .asno(culturalHeritage.getAsno())
                    .name_kr(culturalHeritage.getName_kr())
                    .name_hanja(culturalHeritage.getName_hanja())
                    .content(culturalHeritage.getContent())
                    .sido_name(culturalHeritage.getSido_name())
                    .gugun_name(culturalHeritage.getGugun_name())
                    .division(culturalHeritage.getDivision())
                    .lng(culturalHeritage.getLng())
                    .lat(culturalHeritage.getLat())
                    .image_source(culturalHeritage.getImage_source())
                    .image_detail(culturalHeritage.getImage_detail())
                    .narration(culturalHeritage.getNarration())
                    .video_source(culturalHeritage.getVideo_source())
                    .build();
            culturalHeritageRedisRepository.save(culturalHeritageRedis);
        }
    }

    @Override
    public List<CulturalHeritage> getList() {
        List<CulturalHeritageRedis> culturalHeritageRedisList = (List<CulturalHeritageRedis>) culturalHeritageRedisRepository.findAll();
        List<CulturalHeritage> culturalHeritageList = new ArrayList<>();
        for(CulturalHeritageRedis culturalHeritageRedis : culturalHeritageRedisList){
            culturalHeritageList.add(new CulturalHeritage(culturalHeritageRedis.getNo(),
                    culturalHeritageRedis.getAsno(), culturalHeritageRedis.getName_kr(),
                    culturalHeritageRedis.getName_hanja(), culturalHeritageRedis.getContent(),
                    culturalHeritageRedis.getSido_name(), culturalHeritageRedis.getGugun_name(),
                    culturalHeritageRedis.getDivision(), culturalHeritageRedis.getLng(),
                    culturalHeritageRedis.getLat(), culturalHeritageRedis.getImage_source(),
                    culturalHeritageRedis.getImage_detail(), culturalHeritageRedis.getNarration(),
                    culturalHeritageRedis.getVideo_source()));
        }
        return culturalHeritageList;
    }
}
