package org.jackpot.back.security.model.dto.oauth;

import org.jackpot.back.user.model.entity.enums.AuthProvider;

public interface OAuth2UserInfo {
    String getProviderId();
    AuthProvider getProvider(); //소셜
    String getEmail();
    String getName();
    String getProfile(); //프로필 사진
}
