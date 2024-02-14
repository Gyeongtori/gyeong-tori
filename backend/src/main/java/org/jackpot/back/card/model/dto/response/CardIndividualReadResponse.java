package org.jackpot.back.card.model.dto.response;

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
public class CardIndividualReadResponse {
    private Integer no; //문화재 번호
    private String culturalHeritageName;
    private String division; //종목
    private String sido;
    private String gugun;
    private String content; //문화재 설명
    private Long number; //카드 번호
    private String field; //속성
    private Integer rating; //카드 등급
    private String image;

}
