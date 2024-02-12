package org.jackpot.back.user.model.service;

import org.jackpot.back.user.model.dto.request.RegistUserRequest;
import org.jackpot.back.user.model.dto.request.UpdateNicknameRequest;
import org.jackpot.back.user.model.dto.request.UpdateProfileImageRequest;
import org.jackpot.back.user.model.entity.User;

public interface UserService {
    void registUser(RegistUserRequest registUserRequest);
    void updateNickname(User user, UpdateNicknameRequest updateNicknameRequest);
    void updateProfileImage(User user, UpdateProfileImageRequest updateProfileImageRequest);

    User findByEmail(String email);
}
