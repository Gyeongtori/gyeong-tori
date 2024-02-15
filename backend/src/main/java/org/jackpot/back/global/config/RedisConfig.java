package org.jackpot.back.global.config;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.card.model.repository.en.CardRedisENRepository;
import org.jackpot.back.card.model.repository.kr.CardRedisRepository;
import org.jackpot.back.culturalHeritage.model.entity.kr.CulturalHeritageRedis;
import org.jackpot.back.culturalHeritage.model.repository.en.CulturalHeritageENRedisRepository;
import org.jackpot.back.culturalHeritage.model.repository.kr.CulturalHeritageKRRedisRepository;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableCaching
@RequiredArgsConstructor
@EnableRedisRepositories(basePackages = {"org.jackpot.back.security.repository","org.jackpot.back.battle.repository"},
                            basePackageClasses = {
                                    CulturalHeritageKRRedisRepository.class,
                                    CardRedisRepository.class,
                                    CulturalHeritageENRedisRepository.class,
                                    CardRedisENRepository.class
                            })

public class RedisConfig {

    private final RedisProperties redisProperties;

    // lettuce
//    @Bean
//    @Profile("dev")
//    public RedisConnectionFactory redisConnectionFactoryDev() {
//        return new LettuceConnectionFactory(
//                new RedisStandaloneConfiguration(redisProperties.getHost(), redisProperties.getPort()));
//    }
//
//    @Bean
//    @Profile("dev")
//    public RedisTemplate<?, ?> redisTemplateDev() {
//        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setConnectionFactory(redisConnectionFactoryDev());   //connection
//        redisTemplate.setKeySerializer(new StringRedisSerializer());    // key
//        redisTemplate.setValueSerializer(new StringRedisSerializer());  // value
//        return redisTemplate;
//    }

    @Bean
    @Profile("dev")
    public RedisConnectionFactory redisConnectionFactoryProd() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisProperties.getHost());
        config.setPort(redisProperties.getPort());
        config.setPassword(RedisPassword.of(redisProperties.getPassword()));
        return new LettuceConnectionFactory(config);
    }

    // Redis template
    @Bean
    @Profile("dev")
    public RedisTemplate<?, ?> redisTemplateProd() {
        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactoryProd());   //connection
        redisTemplate.setKeySerializer(new StringRedisSerializer());    // key
        redisTemplate.setValueSerializer(new StringRedisSerializer());  // value
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(CulturalHeritageRedis.class));
        return redisTemplate;
    }
}
