package org.jackpot.back.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.global.utils.MessageUtils;
import org.jackpot.back.user.model.dto.request.RegistUserRequest;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @PostMapping("/regist")
    public ResponseEntity registUser(@RequestBody RegistUserRequest registUserRequest){
        userService.registUser(registUserRequest);
        return ResponseEntity.ok().body(MessageUtils.success());
    }

    @PostMapping("/retrieve")
    public ResponseEntity getUser(@AuthenticationPrincipal User user){
        System.out.println(user.toString());
        return ResponseEntity.ok().body(MessageUtils.success(user));
    }

}
