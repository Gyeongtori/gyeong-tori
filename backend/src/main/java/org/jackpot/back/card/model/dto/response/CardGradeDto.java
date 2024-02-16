package org.jackpot.back.card.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CardGradeDto {
    private Long cardNumber;
    private int grade;
    private String image;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private List<LocalDate> holdingCards; //보유 카드 정보
}
