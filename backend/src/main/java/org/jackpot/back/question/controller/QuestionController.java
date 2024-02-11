package org.jackpot.back.question.controller;

import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.question.model.dto.request.QuestionRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/v1/question")
public class QuestionController {
    @PostMapping("/list")
    public ResponseEntity getQuestionList(@RequestBody QuestionRequest questionRequest){

        return ResponseEntity.ok().body(MessageUtils.success());
    }
}
