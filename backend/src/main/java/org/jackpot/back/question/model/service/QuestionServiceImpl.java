package org.jackpot.back.question.model.service;

import jakarta.transaction.TransactionalException;
import lombok.RequiredArgsConstructor;
import org.jackpot.back.global.model.Language;
import org.jackpot.back.question.exception.QuestionErrorCode;
import org.jackpot.back.question.exception.QuestionException;
import org.jackpot.back.question.model.dto.QuestionDto;
import org.jackpot.back.question.model.dto.request.QuestionRequest;
import org.jackpot.back.question.model.entity.QuestionEN;
import org.jackpot.back.question.model.entity.QuestionKR;
import org.jackpot.back.question.model.repository.QuestionENRepository;
import org.jackpot.back.question.model.repository.QuestionKRRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService{
    private final QuestionKRRepository questionRepositoryKR;
    private final QuestionENRepository questionRepositoryEN;
    @Override
    public List<QuestionDto> getQuestions(QuestionRequest questionRequest) {
        if(questionRequest.getLanguage()== Language.KR) { //한국어
            List<QuestionKR> questionList = null;
            try {
                questionList = questionRepositoryKR.findByIds(questionRequest.getCardList())
                        .orElseThrow(() -> new QuestionException(QuestionErrorCode.NOT_EXISTS));
            } catch (TransactionalException e) {
                throw new QuestionException(QuestionErrorCode.TRANSACTION_FAIL);
            }
            List<QuestionDto> questionDtoList = new ArrayList<>();
            for (QuestionKR question : questionList) {
                questionDtoList.add(question.toDto());
            }
            return questionDtoList;
        }else{
            List<QuestionEN> questionList = null;
            try {
                questionList = questionRepositoryEN.findByIds(questionRequest.getCardList())
                        .orElseThrow(() -> new QuestionException(QuestionErrorCode.NOT_EXISTS));
            } catch (TransactionalException e) {
                throw new QuestionException(QuestionErrorCode.TRANSACTION_FAIL);
            }
            List<QuestionDto> questionDtoList = new ArrayList<>();
            for (QuestionEN question : questionList) {
                questionDtoList.add(question.toDto());
            }
            return questionDtoList;
        }
    }
}
