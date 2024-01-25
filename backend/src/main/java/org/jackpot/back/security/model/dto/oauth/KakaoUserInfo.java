package org.jackpot.back.security.model.dto.oauth;

import org.jackpot.back.user.model.entity.enums.AuthProvider;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo{
    private String id;
    private Map<String, Object> attributes;

    public KakaoUserInfo(Map<String, Object> attributes, String id) {
        this.attributes = attributes;
        this.id = id;
    }

    @Override
    public String getProviderId() {
        return id;
    }

    @Override
    public AuthProvider getProvider() {
        return AuthProvider.KAKAO;
    }

    @Override
    public String getEmail() {
        return String.valueOf(attributes.get("email"));
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getProfile() {
        Map<String, Object> profile = (Map<String, Object>) attributes.get("profile");
        if (profile != null) {
            return (String) profile.get("profile_image_url");
        }
        return null;
    }
}
