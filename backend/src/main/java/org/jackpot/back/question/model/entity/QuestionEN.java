package org.jackpot.back.question.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.jackpot.back.card.model.entity.kr.Card;
import org.jackpot.back.question.model.dto.QuestionDto;

@Entity
@Table(name="question_en")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@ToString
public class QuestionEN {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long id; //카드 번호

    @Column(name="problem_detail")
    public String detail;

    @Column
    public String answer;

    @ManyToOne
    @JoinColumn(name="card_no")
    public Card card;

    public QuestionDto toDto(){
        return QuestionDto.builder()
                .id(id)
                .detail(detail)
                .answer(answer)
                .card(card.toDto())
                .build();
    }
}
