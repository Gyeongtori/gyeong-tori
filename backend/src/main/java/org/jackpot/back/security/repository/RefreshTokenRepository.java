package org.jackpot.back.security.repository;


import org.jackpot.back.security.model.entity.Token;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<Token, Long> {
    Optional<Token> findByAccessToken(String accessToken);
}
