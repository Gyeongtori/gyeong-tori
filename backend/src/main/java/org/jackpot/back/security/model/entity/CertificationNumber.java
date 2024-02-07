package org.jackpot.back.security.model.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@AllArgsConstructor
@Builder
@RedisHash(value = "certificationNumber", timeToLive = 60 * 3 )
public class CertificationNumber {
    @Id
    private String email;
    private String number;
}