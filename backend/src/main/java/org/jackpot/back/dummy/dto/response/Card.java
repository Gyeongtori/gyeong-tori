package org.jackpot.back.dummy.dto.response;

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
public class Card{
    Integer cardId;
    String cardAt;
    String nameKr;
    String nameEng;
    Integer rating;
    String gugunName;
    String field;
    String img;
    String category;
    String description;
}
