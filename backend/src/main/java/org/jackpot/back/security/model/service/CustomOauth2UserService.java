package org.jackpot.back.security.model.service;

import lombok.RequiredArgsConstructor;
import org.jackpot.back.security.model.dto.oauth.GoogleUserInfo;
import org.jackpot.back.security.model.dto.oauth.KakaoUserInfo;
import org.jackpot.back.security.model.dto.oauth.NaverUserInfo;
import org.jackpot.back.security.model.dto.oauth.OAuth2UserInfo;
import org.jackpot.back.user.model.entity.User;
import org.jackpot.back.user.model.entity.enums.AuthProvider;
import org.jackpot.back.user.model.entity.enums.UserRole;
import org.jackpot.back.user.model.entity.enums.UserStatus;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

// 사용자 정보 불러오고 회원가입 or 업데이트 처리
@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {
    private final PasswordEncoder bCryptPasswordEncoder; //비밀번호 암호화
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) {
        OAuth2User oauth2User = super.loadUser(oAuth2UserRequest); //사용자 정보 불러오기
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId(); //registrationId로 어떤 OAuth로 로그인 했는지 확인 가능

        OAuth2UserInfo oAuth2UserInfo = getOAuth2UserInfo(oauth2User, registrationId);
        saveUser(oAuth2UserInfo);

        return oauth2User;
    }

    public OAuth2UserInfo getOAuth2UserInfo(OAuth2User oAuth2User, String registrationId){
        //구글
        if(registrationId.equals("google")){
            System.out.println("google 정보 : " + oAuth2User.getAttributes());
            return new GoogleUserInfo(oAuth2User.getAttributes());
        }
        //네이버
        else if(registrationId.equals("naver")) {
            System.out.println("naver 정보 : " + (Map)oAuth2User.getAttributes().get("response"));
            return new NaverUserInfo((Map)oAuth2User.getAttributes().get("response"));
        }
        //카카오
        else if(registrationId.equals("kakao")) {
            System.out.println("kakao 정보 : " + (Map)oAuth2User.getAttributes().get("kakao_account"));
            return new KakaoUserInfo((Map)oAuth2User.getAttributes().get("kakao_account"),
                    String.valueOf(oAuth2User.getAttributes().get("id")));
        }

        return null;
    }

    public void saveUser(OAuth2UserInfo oAuth2UserInfo){
        String email = oAuth2UserInfo.getEmail();
        String nickname = "익명"; //임의 닉네임
        String password =  bCryptPasswordEncoder.encode("${oauth2.password}"); //임의 비밀번호 값 암호화 (중요X)
        String profileImage = oAuth2UserInfo.getProfile();
        AuthProvider authProvider = oAuth2UserInfo.getProvider();
        UserRole role = UserRole.USER;

        Optional<User> findUser = userRepository.findByEmail(email);

        //처음 서비스를 이용한 회원일 경우 -> 회원가입
        if(!findUser.isPresent()) {
            User userEntity = User.builder()
                    .email(email)
                    .nickname(nickname)
                    .password(password)
                    .profileImage(profileImage)
                    .grade(1)
                    .provider(authProvider)
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .build();

            System.out.println(userEntity.toString());
            userRepository.save(userEntity); //회원가입
        }
        //이미 있는 회원인 경우 정보 갱신
        else {
            //정보 갱신 로직 구현
        }
    }
}
