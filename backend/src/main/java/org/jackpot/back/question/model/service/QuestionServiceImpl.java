package org.jackpot.back.question.model.service;

import jakarta.transaction.TransactionalException;
import lombok.RequiredArgsConstructor;
import org.jackpot.back.question.exception.QuestionErrorCode;
import org.jackpot.back.question.exception.QuestionException;
import org.jackpot.back.question.model.dto.QuestionDto;
import org.jackpot.back.question.model.dto.request.QuestionRequest;
import org.jackpot.back.question.model.entity.Question;
import org.jackpot.back.question.model.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService{
    private final QuestionRepository questionRepository;
    @Override
    public List<QuestionDto> getQuestions(QuestionRequest questionRequest) {
        List<Question> questionList = null;
        try {
            questionList = questionRepository.findByIds(questionRequest.getCardList())
                    .orElseThrow(() -> new QuestionException(QuestionErrorCode.NOT_EXISTS));
        }catch (TransactionalException e){
            throw new QuestionException(QuestionErrorCode.TRANSACTION_FAIL);
        }
        List<QuestionDto> questionDtoList=new ArrayList<>();
        for(Question question:questionList){
            questionDtoList.add(question.toDto());
        }
        return questionDtoList;
    }
}
