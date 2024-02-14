package org.jackpot.back.question.model.service;

import org.jackpot.back.question.model.dto.QuestionDto;
import org.jackpot.back.question.model.dto.request.QuestionRequest;

import java.util.List;

public interface QuestionService {
    public List<QuestionDto> getQuestions(QuestionRequest questionRequest);
}
