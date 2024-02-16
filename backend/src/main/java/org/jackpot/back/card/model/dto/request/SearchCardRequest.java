package org.jackpot.back.card.model.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.global.model.Language;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class SearchCardRequest {
    String userEmail;
    String keyword; //검색어
    String division; //종목
    CardField field; //속성
    int sort; //1(이름순_오름차순) or 2(이름순_내림차순) or 3(최신순)
    Language language;
}
