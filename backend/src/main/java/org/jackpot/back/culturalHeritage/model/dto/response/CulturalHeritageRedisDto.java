package org.jackpot.back.culturalHeritage.model.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CulturalHeritageRedisDto {
    Integer no; //고유 키
    String asno; //관리번호
    String name; //문화재명
    String nameHanja; //문화재명(한자)
    String content; //설명
    String sidoName; //시도명
    String gugunName; //시군구명
    String division; //종목코드(카테고리)
    String lng; //경도
    String lat; //위도
    String imageSource; //이미지 주소
    String imageDetail; //이미지 설명
    String narration; //문화재나레이션
    String videoSource; //동영상
}
