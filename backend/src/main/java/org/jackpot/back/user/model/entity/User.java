package org.jackpot.back.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.jackpot.back.global.utils.MaskUtils;
import org.jackpot.back.user.model.dto.response.UserInfoResponse;
import org.jackpot.back.user.model.entity.enums.AuthProvider;
import org.jackpot.back.user.model.entity.enums.UserRole;
import org.jackpot.back.user.model.entity.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Entity
@Table(name="Users")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Getter
@ToString
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, length = 50)
    @NotNull
    private String email;

    @Column
    @NotNull
    private String nickname;

    @Column
    private String password;

    @Column(name = "profile_image", length = 512)
    private String profileImage;

    @Column(columnDefinition = "int not null default 1")
    @NotNull
    private Integer grade; // 골품제 1~8

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'JACKPOT'")
    @NotNull
    private AuthProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'USER'")
    @NotNull
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'ACTIVE'")
    @NotNull
    private UserStatus status;


    public UserInfoResponse toPublicInfo(){
        return UserInfoResponse.builder()
                .id(id)
                .email(email)
                .grade(grade)
                .nickname(nickname)
                .password(MaskUtils.passwordMask(password))
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_" + role.name());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return nickname;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
