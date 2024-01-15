package org.jackpot.back.user.model.service;

import org.jackpot.back.user.model.dto.request.RegistUserRequest;
import org.jackpot.back.user.model.entity.User;

public interface UserService {
    void registUser(RegistUserRequest registUserRequest);

    User findByEmail(String email);
}
