package org.jackpot.back.card.model.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CardDto {
    private Long number; //카드 번호
    private CulturalHeritage culturalHeritage; //문화재 외래키
    private Integer rating; //등급
    private CardField field; //속성 (공,수,힐)
}
