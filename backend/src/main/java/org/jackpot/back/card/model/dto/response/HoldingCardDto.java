package org.jackpot.back.card.model.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.jackpot.back.card.model.entity.enums.CardField;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class HoldingCardDto extends HoldingCardBaseDto{
    private Integer culturalHeritage;
    private String culturalHeritageName;
    private Integer grade;
    private CardField field;
}
