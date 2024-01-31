package org.jackpot.back.battle.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.jackpot.back.card.model.entity.Card;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long id; //문제 아이디

    @Column(name = "problem_detail", length = 512)
    @NotNull
    private String detail; //문제 설명

    @Column
    @NotNull
    private String answer; //문제 답

    @ManyToOne
    @JoinColumn(name="card_number")
    private Card card; //등급

}
