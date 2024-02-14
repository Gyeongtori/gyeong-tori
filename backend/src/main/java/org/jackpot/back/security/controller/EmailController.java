package org.jackpot.back.security.controller;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.security.model.dto.request.EmailConfirmRequest;
import org.jackpot.back.security.model.dto.request.EmailRequest;
import org.jackpot.back.security.model.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/email")
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/join-code")
    public ResponseEntity sendCodeEmail(
            @RequestBody EmailRequest emailRequest
    ){
        emailService.sendJoinCodeMail(emailRequest.getEmail());
        return ResponseEntity.ok(MessageUtils.success());
    }

    @PostMapping("/code")
    public ResponseEntity<MessageUtils> codeEmail(
            @RequestBody EmailRequest emailRequest
    ){
        emailService.sendCodeMail(emailRequest.getEmail());
        return ResponseEntity.ok(MessageUtils.success());
    }

    @PostMapping("/temp-password")
    public ResponseEntity<MessageUtils> tempPasswordEmail(
            @RequestBody EmailRequest emailRequest
    ){
        emailService.sendTempPasswordMail(emailRequest.getEmail());
        return ResponseEntity.ok(MessageUtils.success());
    }

    @PostMapping("/confirm")
    public ResponseEntity<MessageUtils> confirmNumber(
            @RequestBody EmailConfirmRequest confirmRequest
    ){
        emailService.confirmCode(confirmRequest.getEmail(), confirmRequest.getCode());
        return ResponseEntity.ok(MessageUtils.success());
    }


}