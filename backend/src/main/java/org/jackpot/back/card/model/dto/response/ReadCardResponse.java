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
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class ReadCardResponse {
    private String culturalHeritageName;
    private String sido;
    private String gugun;
    private List<CardGradeDto> gradeCards; //등급별 보유 현황
    private String image;
    private String field;
    private String description;
}
