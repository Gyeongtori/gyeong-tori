package org.jackpot.back.culturalHeritage.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.exception.CulturalHeritageException;
import org.jackpot.back.culturalHeritage.model.dto.request.GetCulturalHeritageDistanceListRequest;
import org.jackpot.back.culturalHeritage.model.dto.response.CulturalHeritageRedisDto;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageEN;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageRedisEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.en.CulturalHeritageENRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.en.CulturalHeritageENRepository;
import org.jackpot.back.culturalHeritage.model.repository.kr.CulturalHeritageKRRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.kr.CulturalHeritageKRRepository;
import org.jackpot.back.global.model.Language;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.*;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.jackpot.back.culturalHeritage.exception.CulturalHeritageErrorCode.TRANSACTION_FAIL;

@RequiredArgsConstructor
@Service
@Slf4j
public class CulturalHeritageServiceImpl implements CulturalHeritageService{
    private final CulturalHeritageKRRepository culturalHeritageRepository;
    private final CulturalHeritageKRRedisRepository culturalHeritageRedisRepository;

    private final CulturalHeritageENRepository culturalHeritageENRepository;
    private final CulturalHeritageENRedisRepository culturalHeritageENRedisRepository;

    // RedisTemplate을 통해 GeoOperations 생성
    private GeoOperations<String, String> geoOperations;
    @Autowired
    public void setGeoOperations(RedisTemplate<String, String> redisTemplate) {
        this.geoOperations = redisTemplate.opsForGeo();
    }

    @Override
    public void redisSave() {
        try{
            //문화재 DB 조회
            List<CulturalHeritage> culturalHeritageList = culturalHeritageRepository.findAll();
            List<CulturalHeritageEN> culturalHeritageENList = culturalHeritageENRepository.findAll();
            //DB -> Redis 저장
            for(CulturalHeritage culturalHeritage : culturalHeritageList) {
                CulturalHeritageRedis culturalHeritageRedis = CulturalHeritageRedis.builder()
                        .no(culturalHeritage.getNo())
                        .asno(culturalHeritage.getAsno())
                        .nameKr(culturalHeritage.getNameKr())
                        .nameHanja(culturalHeritage.getNameHanja())
                        .content(culturalHeritage.getContent())
                        .sidoName(culturalHeritage.getSidoName())
                        .gugunName(culturalHeritage.getGugunName())
                        .division(culturalHeritage.getDivision())
                        .lng(culturalHeritage.getLng())
                        .lat(culturalHeritage.getLat())
                        .imageSource(culturalHeritage.getImageSource())
                        .imageDetail(culturalHeritage.getImageDetail())
                        .narration(culturalHeritage.getNarration())
                        .videoSource(culturalHeritage.getVideoSource())
                        .build();

                culturalHeritageRedisRepository.save(culturalHeritageRedis);
                // Geo 데이터 추가
                geoOperations.add("geopoints_kr", new Point(
                        Double.parseDouble(culturalHeritageRedis.getLng()),
                        Double.parseDouble(culturalHeritageRedis.getLat())),
                        culturalHeritageRedis.getNo().toString()
                );
            }
            for(CulturalHeritageEN culturalHeritageEN : culturalHeritageENList) {
                CulturalHeritageRedisEN culturalHeritageRedisEN = CulturalHeritageRedisEN.builder()
                        .no(culturalHeritageEN.getNo())
                        .asno(culturalHeritageEN.getAsno())
                        .nameEn(culturalHeritageEN.getNameEn())
                        .nameHanja(culturalHeritageEN.getNameHanja())
                        .content(culturalHeritageEN.getContent())
                        .sidoName(culturalHeritageEN.getSidoName())
                        .gugunName(culturalHeritageEN.getGugunName())
                        .division(culturalHeritageEN.getDivision())
                        .lng(culturalHeritageEN.getLng())
                        .lat(culturalHeritageEN.getLat())
                        .imageSource(culturalHeritageEN.getImageSource())
                        .imageDetail(culturalHeritageEN.getImageDetail())
                        .narration(culturalHeritageEN.getNarration())
                        .videoSource(culturalHeritageEN.getVideoSource())
                        .build();

                culturalHeritageENRedisRepository.save(culturalHeritageRedisEN);
                // Geo 데이터 추가
                geoOperations.add(
                        "geopoints_en", new Point(
                                Double.parseDouble(culturalHeritageRedisEN.getLng()),
                                Double.parseDouble(culturalHeritageRedisEN.getLat())
                            ), culturalHeritageRedisEN.getNo().toString()
                );
            }
        } catch (Exception e){
            throw new CulturalHeritageException(TRANSACTION_FAIL);
        }
    }

    @Override
    public List<CulturalHeritageRedisDto> getCulturalHeritageList(Language language) {
        List<CulturalHeritageRedisDto> culturalHeritageRedisDtoList=new ArrayList<>();
        try {
            if(language==Language.EN) { //영어
                List<CulturalHeritageRedisEN> culturalHeritageRedisList = (List<CulturalHeritageRedisEN>) culturalHeritageENRedisRepository.findAll();
                for(CulturalHeritageRedisEN culturalHeritageRedis:culturalHeritageRedisList){
                    culturalHeritageRedisDtoList.add(culturalHeritageRedis.toDto());
                }
            }else { //한국어
                List<CulturalHeritageRedis> culturalHeritageRedisList = (List<CulturalHeritageRedis>) culturalHeritageRedisRepository.findAll();
                for(CulturalHeritageRedis culturalHeritageRedis:culturalHeritageRedisList){
                    culturalHeritageRedisDtoList.add(culturalHeritageRedis.toDto());
                }
            }
            return culturalHeritageRedisDtoList;
        } catch(Exception e){
            throw new CulturalHeritageException(TRANSACTION_FAIL);
        }
    }
    @Override
    public List<CulturalHeritageRedisDto> getCulturalHeritageDistanceList(GetCulturalHeritageDistanceListRequest getCulturalHeritageDistanceListRequest) {
        List<CulturalHeritageRedisDto> culturalHeritageRedisDtoList = new ArrayList<>();
        // 검색 중심 좌표
        Point center = new Point(Double.parseDouble(getCulturalHeritageDistanceListRequest.getLng()), Double.parseDouble(getCulturalHeritageDistanceListRequest.getLat()));
        // 거리 단위 및 반경 설정
        Metric metric = RedisGeoCommands.DistanceUnit.METERS;
        Distance distance = new Distance(500, metric);
        Circle circle = new Circle(center, distance);

        RedisGeoCommands.GeoRadiusCommandArgs args = RedisGeoCommands
                .GeoRadiusCommandArgs
                .newGeoRadiusArgs()
                .includeDistance() //거리 정보 포함
//                .includeCoordinates()
                .sortAscending(); //가까운 순서 정렬
        GeoResults<RedisGeoCommands.GeoLocation<String>> radius=null;

        if(getCulturalHeritageDistanceListRequest.getLanguage()==Language.EN) {
            List<CulturalHeritageRedisEN> culturalHeritageRedisENList = new ArrayList<>();
            //중심 기준으로 500m 위치 조회
             radius = geoOperations.radius("geopoints_en", circle, args);
        } else {
            List<CulturalHeritageRedis> culturalHeritageRedisList = new ArrayList<>();
            //중심 기준으로 500m 위치 조회
            radius = geoOperations.radius("geopoints_kr", circle, args);
        }
        try{
            //반경 이내 조회된 결과 response에 담기
            if(getCulturalHeritageDistanceListRequest.getLanguage()==Language.EN){
                if (radius != null) {
                    radius.forEach(geoLocationGeoResult -> {
                        RedisGeoCommands.GeoLocation<String> content = geoLocationGeoResult.getContent();
                        String name = content.getName(); //문화재 No 반환
                        //                Distance dis = geoLocationGeoResult.getDistance(); //거리 반환
                        culturalHeritageRedisDtoList.add(culturalHeritageENRedisRepository.findById(Integer.parseInt(name)).get().toDto());
                    });
                }
            } else {
                if (radius != null) {
                    radius.forEach(geoLocationGeoResult -> {
                        RedisGeoCommands.GeoLocation<String> content = geoLocationGeoResult.getContent();
                        String name = content.getName(); //문화재 No 반환
                        //                Distance dis = geoLocationGeoResult.getDistance(); //거리 반환
                        culturalHeritageRedisDtoList.add(culturalHeritageRedisRepository.findById(Integer.parseInt(name)).get().toDto());
                    });
                }
            }
        } catch (Exception e){
            throw new CulturalHeritageException(TRANSACTION_FAIL);
        }

        return culturalHeritageRedisDtoList;
    }
}
