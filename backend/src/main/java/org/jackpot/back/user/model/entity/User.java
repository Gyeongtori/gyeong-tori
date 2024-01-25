package org.jackpot.back.user.model.entity;

import jakarta.persistence.*;
import lombok.*;
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
@Builder
@Getter
@ToString
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String email;

    @Column(nullable = false, length = 255)
    private String nickname;

    @Column(nullable = true, length = 255)
    private String password;

    @Column(name = "profile_image", nullable = true, length = 512)
    private String profileImage;

    @Column(columnDefinition = "int not null default 1")
    private Integer grade; // 골품제 1~8

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'JACKPOT'")
    private AuthProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'USER'")
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(10) not null default 'ACTIVE'")
    private UserStatus status;

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
