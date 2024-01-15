package org.jackpot.back.user.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.user.exception.UserException;
import org.jackpot.back.user.model.dto.request.RegistUserRequest;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.jackpot.back.user.exception.UserErrorCode.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void registUser(RegistUserRequest registUserRequest) {
        log.debug("error={}",registUserRequest);
        userRepository.findByEmail(registUserRequest.getEmail())
                        .ifPresent(value -> {throw new UserException(ALREADY_IN_EMAIL);});
        registUserRequest.setPassword(passwordEncoder.encode(registUserRequest.getPassword()));
        userRepository.save(registUserRequest.toEntity());
    }

    @Override
    public User findByEmail(String email) {
        log.info("repository : "+userRepository.findByEmail(email).get().toString());
        return userRepository.findByEmail(email)
                .orElseThrow(()->new UserException(NOT_EXISTS_USER));
    }
}
