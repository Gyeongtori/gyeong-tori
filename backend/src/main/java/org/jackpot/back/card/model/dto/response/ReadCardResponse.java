package org.jackpot.back.card.model.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class ReadCardResponse {
    private Integer no; //primary key
    private boolean have; //카드 보유 여부
    private String culturalHeritageName;
    private String division; //종목
    private String sido;
    private String gugun;
    private String address;
    private List<CardGradeDto> gradeCards; //등급별 카드
    private String image;
    private String field; //속성
    private String description;
}
