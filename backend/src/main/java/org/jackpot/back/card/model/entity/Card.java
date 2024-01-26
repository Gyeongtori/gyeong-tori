package org.jackpot.back.card.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long id; //카드 번호

    @ManyToOne
    @JoinColumn(name="cultural_heritage_no")
    private CulturalHeritage no; //등급

    @Column
    @NotNull
    private Integer rating; //등급

    @Enumerated(EnumType.STRING)
    @Column
    @NotNull
    private CardField field; //속성 (공,수,힐)

}
