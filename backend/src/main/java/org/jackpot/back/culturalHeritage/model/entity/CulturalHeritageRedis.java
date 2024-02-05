package org.jackpot.back.culturalHeritage.model.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@ToString
@RedisHash(value = "cultural_heritage_redis", timeToLive = -1L)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CulturalHeritageRedis {
    @Id
    private Integer no; //고유 키 값
    private String asno; //관리번호
    private String name_kr; //문화재명(국문)
    private String name_hanja; //문화재명(한자)
    private String content; //설명
    private String sido_name; //시도명
    private String gugun_name; //시군구명
    private String division; //종목코드(카테고리)
    private String lng; //경도
    private String lat; //위도
    private String image_source; //이미지 주소
    private String image_detail; //이미지 설명
    private String narration; //문화재나레이션
    private String video_source; //동영상
}
