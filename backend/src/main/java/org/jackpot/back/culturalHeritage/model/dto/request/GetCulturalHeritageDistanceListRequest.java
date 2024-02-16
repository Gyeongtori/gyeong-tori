package org.jackpot.back.culturalHeritage.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jackpot.back.global.model.Language;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GetCulturalHeritageDistanceListRequest {
    String lng; //경도
    String lat; //위도
    Language language;// 언어
}
