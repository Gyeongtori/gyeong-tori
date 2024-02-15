package org.jackpot.back.question.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.model.Language;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.question.model.dto.QuestionDto;
import org.jackpot.back.question.model.dto.request.QuestionRequest;
import org.jackpot.back.question.model.service.QuestionService;
import org.jackpot.back.user.model.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/v1/question")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    @PostMapping("/list")
    public ResponseEntity getQuestionList(@AuthenticationPrincipal User user, @RequestBody QuestionRequest questionRequest){
        log.info("카드 목록 : {}",questionRequest.toString());
        questionRequest.setLanguage(user.getLanguage());
        return ResponseEntity.ok().body(MessageUtils.success(questionService.getQuestions(questionRequest)));
    }
}
