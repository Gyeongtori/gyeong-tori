package org.jackpot.back.socket.model.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.jackpot.back.dummy.dto.response.Card;
import org.jackpot.back.question.model.dto.QuestionDto;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class BattleQuestion extends BaseAction{
    //todo 담을 내용 확정 짓기
    private QuestionDto question;
}
