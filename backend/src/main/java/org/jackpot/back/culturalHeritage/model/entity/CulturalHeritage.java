package org.jackpot.back.culturalHeritage.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name="cultural_heritage")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class CulturalHeritage {
    @Id
    @Column
    private Integer no; //고유 키 값

    @Column(length = 30)
    @NotNull
    private String name_kr; //문화재명(국문)

    @Column(length = 30)
    @NotNull
    private String name_hanja; //문화재명(한자)

    @Column(length = 10)
    @NotNull
    private String sido_name; //시도명

    @Column(length = 10)
    @NotNull
    private String gugun_name; //시군구명

    @Column(length = 5)
    @NotNull
    private String division; //종목코드(카테고리)

    @Column(length = 10)
    @NotNull
    private String lng; //경도

    @Column(length = 10)
    @NotNull
    private String lat; //위도

    @Column
    @NotNull
    private String image_source; //이미지 주소

    @Column(length = 512)
    @NotNull
    private String image_detail; //이미지 설명

    @Column(length = 512)
    private String narration; //문화재나레이션

    @Column(length = 512)
    private String video_source; //동영상

}
