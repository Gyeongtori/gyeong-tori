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
public class HoldingCardListDto {
    private List<HoldingCardDto> holdingCards;
}
