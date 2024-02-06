package org.jackpot.back.culturalHeritage.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.culturalHeritage.model.dto.request.GetCulturalHeritageListRequest;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.CulturalHeritageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.*;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.index.GeoIndexed;
import org.springframework.stereotype.Service;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CulturalHeritageServiceImpl implements CulturalHeritageService{
    private final CulturalHeritageRepository culturalHeritageRepository;
    private final CulturalHeritageRedisRepository culturalHeritageRedisRepository;

    // RedisTemplate을 통해 GeoOperations 생성
    private GeoOperations<String, String> geoOperations;
    @Autowired
    public void setGeoOperations(RedisTemplate<String, String> redisTemplate) {
        this.geoOperations = redisTemplate.opsForGeo();
    }

    @Override
    public void redisSave() {
        //문화재 DB 조회
        List<CulturalHeritage> culturalHeritageList = culturalHeritageRepository.findAll();
        //DB -> Redis 저장
        for(CulturalHeritage culturalHeritage : culturalHeritageList){
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
            geoOperations.add("geopoints", new Point(Double.parseDouble(culturalHeritageRedis.getLng()), Double.parseDouble(culturalHeritageRedis.getLat())), culturalHeritageRedis.getNo().toString());
        }
    }

    @Override
    public List<CulturalHeritageRedis> getList(GetCulturalHeritageListRequest getCulturalHeritageListRequest) {
        List<CulturalHeritageRedis> culturalHeritageRedisList = new ArrayList<>();

        // 검색 중심 좌표
        Point center = new Point(Double.parseDouble(getCulturalHeritageListRequest.getLng()), Double.parseDouble(getCulturalHeritageListRequest.getLat()));
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

        //중심 기준으로 500m 위치 조회
        GeoResults<RedisGeoCommands.GeoLocation<String>> radius = geoOperations
                .radius("geopoints", circle, args);

        //반경 이내 조회된 결과 respone에 담기
        if (radius != null) {
            radius.forEach(geoLocationGeoResult -> {
                RedisGeoCommands.GeoLocation<String> content = geoLocationGeoResult.getContent();
                String name = content.getName(); //문화재 No 반환
//                Distance dis = geoLocationGeoResult.getDistance(); //거리 반환

                culturalHeritageRedisList.add(culturalHeritageRedisRepository.findById(Integer.parseInt(name)).get());
            });
        }

        return culturalHeritageRedisList;
    }
}
