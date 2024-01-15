package org.jackpot.back.global.utils;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

import static org.springframework.http.HttpStatus.*;

@Data
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MessageUtils<T> {
    private final DataHeader dataHeader;
    private final T dataBody;
    public static <T> MessageUtils<T> success(T dataBody) {
        return MessageUtils.<T>builder()
                .dataHeader(DataHeader.success())
                .dataBody(dataBody)
                .build();
    }

    public static <T> MessageUtils<T> success(T dataBody, String code, String resultMessage) {
        return MessageUtils.<T>builder()
                .dataHeader(DataHeader.success(code, resultMessage))
                .dataBody(dataBody)
                .build();
    }

    public static MessageUtils success() {
        return MessageUtils.builder()
                .dataHeader(DataHeader.noContentSuccess())
                .build();
    }

    public static <T> MessageUtils<T> fail(String resultCode, String resultMessage) {
        return MessageUtils.<T>builder()
                .dataHeader(DataHeader.fail(resultCode, resultMessage))
                .dataBody(null)
                .build();
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
    private static class DataHeader {

        private int successCode;
        private String resultCode;
        private String resultMessage;

        private static DataHeader noContentSuccess() {
            return DataHeader.builder()
                    .successCode(0)
                    .resultCode(NO_CONTENT.toString())
                    .build();
        }

        private static DataHeader success() {
            return DataHeader.builder()
                    .successCode(0)
                    .resultCode(OK.toString())
                    .build();
        }



        private static DataHeader success(String code, String resultMessage) {
            return DataHeader.builder()
                    .successCode(0)
                    .resultCode(code)
                    .resultMessage(resultMessage)
                    .build();
        }

        private static DataHeader fail(String resultCode, String resultMessage) {
            return DataHeader.builder()
                    .successCode(1)
                    .resultCode(resultCode)
                    .resultMessage(resultMessage)
                    .build();
        }
    }
}
