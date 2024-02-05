package org.jackpot.back.culturalHeritage.model.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
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
    private String asno; //관리번호

    @Column(length = 30)
    @NotNull
    private String nameKr; //문화재명(국문)

    @Column(length = 30)
    @NotNull
    private String nameHanja; //문화재명(한자)

    @Column(length = 5000)
    @NotNull
    private String content; //설명

    @Column(length = 10)
    @NotNull
    private String sidoName; //시도명

    @Column(length = 10)
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

    @Column
    @NotNull
    private String imageSource; //이미지 주소

    @Column
    @NotNull
    private String imageDetail; //이미지 설명

    @Column(length = 512)
    private String narration; //문화재나레이션

    @Column(length = 512)
    private String videoSource; //동영상

}
