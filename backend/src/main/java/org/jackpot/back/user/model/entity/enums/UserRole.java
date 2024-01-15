package org.jackpot.back.user.model.entity.enums;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("ADMIN","관리자"),
    USER("USER","일반 사용자");

    private final String role;
    private final String roleKR;

    UserRole(String role, String roleKR) {
        this.role=role;
        this.roleKR = roleKR;
    }
}
