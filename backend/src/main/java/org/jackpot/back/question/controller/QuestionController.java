package org.jackpot.back.question.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.question.model.dto.request.QuestionRequest;
import org.jackpot.back.question.model.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/v1/question")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    @PostMapping("/list")
    public ResponseEntity getQuestionList(@RequestBody QuestionRequest questionRequest){
        log.info("카드 목록 : {}",questionRequest.toString());
        return ResponseEntity.ok().body(MessageUtils.success(questionService.getQuestions(questionRequest)));
    }
}
