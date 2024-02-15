package org.jackpot.back.culturalHeritage.model.entity.en;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.jackpot.back.culturalHeritage.model.dto.response.CulturalHeritageRedisDto;

@Entity
@Table(name="cultural_heritage_en")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class CulturalHeritageEN {
    @Id
    @Column
    private Integer no; //고유 키 값

    @Column(length = 30)
    @NotNull
    private String asno; //관리번호

    @Column(name = "name_en", length = 100)
    @NotNull
    private String nameEn; //문화재명(영문)

    @Column(name = "name_hanja", length = 30)
    @NotNull
    private String nameHanja; //문화재명(한자)

    @Column(length = 5000)
    @NotNull
    private String content; //설명

    @Column(name = "sido_name", length = 10)
    @NotNull
    private String sidoName; //시도명

    @Column(name = "gugun_name", length = 10)
    @NotNull
    private String gugunName; //시군구명

    @Column(length = 5)
    @NotNull
    private String division; //종목코드(카테고리)

    @Column(length = 50)
    @NotNull
    private String lng; //경도

    @Column(length = 50)
    @NotNull
    private String lat; //위도

    @Column(name = "image_source")
    @NotNull
    private String imageSource; //이미지 주소

    @Column(name = "image_detail")
    @NotNull
    private String imageDetail; //이미지 설명

    @Column(length = 512)
    private String narration; //문화재나레이션

    @Column(name = "video_source", length = 512)
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
