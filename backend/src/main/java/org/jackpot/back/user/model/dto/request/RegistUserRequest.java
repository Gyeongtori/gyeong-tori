package org.jackpot.back.user.model.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.entity.enums.AuthProvider;
import org.jackpot.back.user.model.entity.enums.UserRole;
import org.jackpot.back.user.model.entity.enums.UserStatus;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class RegistUserRequest {
    private String name;
    private String email;
    private String password;

    public User toEntity(){
        return User.builder()
                .id(null)
                .name(name)
                .email(email)
                .password(password)
                .provider(AuthProvider.JACKPOT)
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();
    }
}
