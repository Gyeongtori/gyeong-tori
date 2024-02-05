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
    //Redis Geo
    private final RedisTemplate<String, CulturalHeritageRedis> redisTemplate;
    // RedisTemplate을 통해 GeoOperations 생성
//    private final GeoOperations<String, CulturalHeritageRedis> geoOperations = redisTemplate.opsForGeo();

    @Override
    public void redisSave() {
        //문화재 DB 조회
        List<CulturalHeritage> culturalHeritageList = culturalHeritageRepository.findAll();
        //DB -> Redis 저장
        for(CulturalHeritage culturalHeritage : culturalHeritageList){
            CulturalHeritageRedis culturalHeritageRedis = CulturalHeritageRedis.builder()
                    .no(culturalHeritage.getNo())
                    .asno(culturalHeritage.getAsno())
                    .name_kr(culturalHeritage.getNameKr())
                    .name_hanja(culturalHeritage.getNameHanja())
                    .content(culturalHeritage.getContent())
                    .sido_name(culturalHeritage.getSidoName())
                    .gugun_name(culturalHeritage.getGugunName())
                    .division(culturalHeritage.getDivision())
                    .lng(culturalHeritage.getLng())
                    .lat(culturalHeritage.getLat())
                    .image_source(culturalHeritage.getImageSource())
                    .image_detail(culturalHeritage.getImageDetail())
                    .narration(culturalHeritage.getNarration())
                    .video_source(culturalHeritage.getVideoSource())
                    .build();

            culturalHeritageRedisRepository.save(culturalHeritageRedis);
        }
    }

    @Override
    public List<CulturalHeritageRedis> getList(GetCulturalHeritageListRequest getCulturalHeritageListRequest) {
        List<CulturalHeritageRedis> culturalHeritageRedisList = new ArrayList<>();

        GeoOperations<String, CulturalHeritageRedis> geoOperations = redisTemplate.opsForGeo();

        // Redis Hash에 접근하기 위해 opsForHash()를 사용
        HashOperations<String, Integer, CulturalHeritageRedis> hashOperations = redisTemplate.opsForHash();

        // 검색 중심 좌표
        Point center = new Point(Double.parseDouble(getCulturalHeritageListRequest.getLng()), Double.parseDouble(getCulturalHeritageListRequest.getLat()));

        // 거리 단위 및 반경 설정
        Metric metric = RedisGeoCommands.DistanceUnit.KILOMETERS;
        Distance distance = new Distance(1, metric);
        Circle circle = new Circle(center, distance);

        // Redis의 키 스캔
        ScanOptions scanOptions = ScanOptions.scanOptions().match("cultural_heritage_redis*").build();
        Set<String> matchingKeys = new HashSet<>();
        redisTemplate.executeWithStickyConnection(connection -> {
            connection.scan(scanOptions).forEachRemaining(key -> {
                String decodedKey = new String(key, Charset.forName("UTF-8"));
                matchingKeys.add(decodedKey);
            });
            return null;
        });

        // Geo 검색 수행
        matchingKeys.forEach(key -> {
            // 로그로 확인
//            System.out.println("키!!!!!!!!! " + key);

            GeoResults<RedisGeoCommands.GeoLocation<CulturalHeritageRedis>> geoLocation = geoOperations.radius(key, circle);
//            System.out.println("돈다!!!!!!!!!!!");

            if (geoLocation != null) {
                // Geo 검색 결과에서 CulturalHeritageRedis 객체 가져오기
                geoLocation.forEach(geoLocationGeoResult -> {
                    RedisGeoCommands.GeoLocation<CulturalHeritageRedis> content = geoLocationGeoResult.getContent();
                    CulturalHeritageRedis culturalHeritageRedis = hashOperations.get(key, content.getName().getNo());

                    // 가져온 객체가 null이 아니라면 리스트에 추가
                    if (culturalHeritageRedis != null) {
                        culturalHeritageRedisList.add(culturalHeritageRedis);
                    }
                });
            }
        });

        return culturalHeritageRedisList;
    }
}
