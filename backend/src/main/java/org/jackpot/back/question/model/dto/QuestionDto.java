package org.jackpot.back.question.model.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jackpot.back.card.model.dto.response.CardDto;
import org.jackpot.back.card.model.dto.response.ReadCardResponse;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class QuestionDto {
    public Long id;
    public String detail;
    public String answer;
    public CardDto card;
}
