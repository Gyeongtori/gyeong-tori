package org.jackpot.back.card.model.entity.kr;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.jackpot.back.card.model.dto.response.CardDto;
import org.jackpot.back.card.model.entity.enums.CardField;
import org.jackpot.back.culturalHeritage.model.entity.en.CulturalHeritageEN;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritage;

@Entity
@Table(name="card")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@ToString
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long number; //카드 번호

    @ManyToOne
    @JoinColumn(name="cultural_heritage_no")
    private CulturalHeritage culturalHeritage; //문화재 외래키

    @Column
    @NotNull
    private Integer rating; //등급

    @Enumerated(EnumType.STRING)
    @Column
    @NotNull
    private CardField field; //속성 (공,수,힐)

    @Column(name = "image")
    @NotNull
    private String image; //이미지 주소

    public CardDto toDto(){
        return CardDto.builder()
                .number(number)
                .culturalHeritage(culturalHeritage.toDto())
                .field(field)
                .rating(rating)
                .build();
    }

}
