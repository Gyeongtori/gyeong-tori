package org.jackpot.back.security.utils;

import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class CertificationUtil {
    private final String UPPER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private final String LOWER_CHARS = "abcdefghijklmnopqrstuvwxyz";
    private final String NUMBERS = "0123456789";
    private final String SPECIAL_CHARS = "!@#$%^&*()_+";
    private final int PASSWORD_LENGTH = 8;

    public String createTempPassword() {
        SecureRandom random = new SecureRandom();
        List<String> charCategories = new ArrayList<>(List.of(UPPER_CHARS, LOWER_CHARS, NUMBERS, SPECIAL_CHARS));
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        // 각 카테고리에서 최소 한 문자를 포함시키기
        for (String charCategory : charCategories) {
            password.append(charCategory.charAt(random.nextInt(charCategory.length())));
        }

        // 나머지 비밀번호를 랜덤하게 생성하기
        while (password.length() < PASSWORD_LENGTH) {
            String charCategory = charCategories.get(random.nextInt(charCategories.size()));
            password.append(charCategory.charAt(random.nextInt(charCategory.length())));
        }

        // 비밀번호 문자열의 순서를 섞기
        List<Character> pwdChars = new ArrayList<>();
        for (char c : password.toString().toCharArray()) {
            pwdChars.add(c);
        }
        Collections.shuffle(pwdChars);

        StringBuilder finalPassword = new StringBuilder();
        for (char c : pwdChars) {
            finalPassword.append(c);
        }

        return finalPassword.toString();
    }

    public String createNumber() {
        try {
            return String.valueOf(
                    SecureRandom
                            .getInstanceStrong()
                            .nextInt(888888)+11111);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("인증 번호 생성 에러",e);
        }
    }


}