package org.jackpot.back.culturalHeritage.model.entity.en;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.jackpot.back.culturalHeritage.model.dto.response.CulturalHeritageRedisDto;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@ToString
@RedisHash(value = "cultural_heritage_redis_en", timeToLive = -1L)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CulturalHeritageRedisEN {
    @Id
    private Integer no; //고유 키
    private String asno; //관리번호
    private String nameEn; //문화재명(영문)
    private String nameHanja; //문화재명(한자)
    private String content; //설명
    private String sidoName; //시도명
    private String gugunName; //시군구명
    private String division; //종목코드(카테고리)
    private String lng; //경도
    private String lat; //위도
    private String imageSource; //이미지 주소
    private String imageDetail; //이미지 설명
    private String narration; //문화재나레이션
    private String videoSource; //동영상

    public CulturalHeritageRedisDto toDto(){
        return CulturalHeritageRedisDto.builder()
                .no(no)
                .asno(asno)
                .content(content)
                .division(division)
                .name(nameEn)
                .nameHanja(nameHanja)
                .gugunName(gugunName)
                .imageDetail(imageDetail)
                .imageSource(imageSource)
                .lat(lat)
                .lng(lng)
                .narration(narration)
                .sidoName(sidoName)
                .videoSource(videoSource)
                .build();
    }
}
