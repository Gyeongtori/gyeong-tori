package org.jackpot.back.security.model.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jackpot.back.security.config.EmailConfig;
import org.jackpot.back.security.repository.EmailCertificationRepository;
import org.jackpot.back.security.utils.CertificationUtil;
import org.jackpot.back.user.exception.UserException;
import org.jackpot.back.user.model.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.jackpot.back.user.exception.UserErrorCode.NOT_EXISTS_USER;

@RequiredArgsConstructor
@Slf4j
@Service
public class EmailService {

    private final EmailConfig emailConfig;
    private final PasswordEncoder passwordEncoder;
    private final CertificationUtil certificationUtil;
    private final EmailCertificationRepository repository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public void sendTempPasswordMail(String email){
        // 가입이 되어있는 회원인지 검증 ( 프론트 로직상 인증하고 들어오지만 재검증)
        userRepository.findByEmail(email).orElseThrow(()->new UserException(NOT_EXISTS_USER));
        sendCodeMail(email);
        //임시 비밀번호 생성
        String tempPassword = certificationUtil.createTempPassword();
        log.debug("임시비밀번호 생성 = {}", tempPassword);
        //DB에 업데이트
        userMapper.modify(
                ModifyParam.builder()
                        .email(email)
                        .password(passwordEncoder.encode(tempPassword))
                        .build());
        //메일 생성 및 전송
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
            messageHelper.setFrom(emailConfig.getUserName());
            messageHelper.setTo(email);
            messageHelper.setSubject("[에그로그] 임시 비밀번호 안내 입니다.");
            messageHelper.setText(makeTempPasswordTemplate(tempPassword),true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("메일 생성 오류", e);
        }
    }
    public void sendJoinCodeMail(String email){
        //이미 가입된 이메일인지 검증
        userMapper.find(FindParam.builder().email(email).build())
                .ifPresent(value ->{ throw new UserException(ALREADY_IN_EMAIL);});
        sendCodeMail(email);
    }
    @Transactional
    public void sendCodeMail(String email){
        //인증번호 생성
        String number = certificationUtil.createNumber();
        log.debug("인증번호 생성 = {}", number);
        CertificationNumber certificationNumber = CertificationNumber
                .builder()
                .email(email)
                .number(number)
                .build();
        //레디스에 저장
        repository.save(certificationNumber);
        //메일 생성 및 전송
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
            messageHelper.setFrom(emailConfig.getUserName());
            messageHelper.setTo(email);
            messageHelper.setSubject("[에그로그] 이메일 인증 번호입니다.");
            messageHelper.setText(makeCodeTemplate(number),true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("메일 생성 오류", e);
        }
    }

    @Transactional
    public void confirmCode(String email, String code){
        //email로 레디스에서 찾는다.
        CertificationNumber certificationNumber = repository.findById(email).orElseThrow(()->new AuthException(NOT_FOUND_CODE));
        //코드 확인
        if (certificationNumber.getNumber().equals(code)){
            //같을 경우
            repository.delete(certificationNumber);
        }else {
            //틀릴경우
            throw new AuthException(DIFFERENT_NUMBER);
        }
    }

    private String makeCodeTemplate(String code){
        String mainColor = "#F79009";
        String title = "EGGLOG_AUTH_SERVICE";
        String template =
                "<div style=\"font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid "+mainColor+"; margin: 100px auto; padding: 30px 0; box-sizing: border-box;\">"+
                        "\t<h1 style=\"margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;\">"+
                        "\t\t<span style=\"font-size: 15px; margin: 0 0 10px 3px;\">"+title+"</span><br />"+
                        "\t\t<span style=\"color: "+mainColor+";\">이메일 인증</span> 안내입니다."+
                        "\t</h1>"+
                        "\t<p style=\"font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;\">"+
                        "\t\t안녕하세요.<br />"+
                        "\t\t요청하신 인증 번호가 생성되었습니다.<br />"+
                        "\t\t아래 <b style=\"color: "+mainColor+";\">'인증 번호'</b> 를 확인한 뒤, 인증해주세요<br />"+
                        "\t\t감사합니다."+
                        "\t</p>"+
                        "\t<p style=\"font-size: 16px; margin: 40px 5px 20px; line-height: 28px;\">"+
                        "\t\t인증 번호: <br />"+
                        "\t\t<span style=\"font-size: 24px;\">"+code+"</span>"+
                        "\t</p>"+
                        "\t<div style=\"border-top: 1px solid #DDD; padding: 5px;\">"+
                        "\t\t<p style=\"font-size: 13px; line-height: 21px; color: #555;\">"+
                        "\t\t\t만약 정상적으로 인증 되지 않는다면, 다시 요청해 주세요.<br />"+
                        "\t\t</p>"+
                        "\t</div>"+
                        "</div>";
        return template;
    }

    private String makeTempPasswordTemplate(String tempPassword){
        String mainColor = "#F79009";
        String title = "EGGLOG_AUTH_SERVICE";
        String template =
                "<div style=\"font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid "+mainColor+"; margin: 100px auto; padding: 30px 0; box-sizing: border-box;\">"+
                        "\t<h1 style=\"margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;\">"+
                        "\t\t<span style=\"font-size: 15px; margin: 0 0 10px 3px;\">"+title+"</span><br />"+
                        "\t\t<span style=\"color: "+mainColor+";\">임시 비밀번호</span> 안내입니다."+
                        "\t</h1>"+
                        "\t<p style=\"font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;\">"+
                        "\t\t안녕하세요.<br />"+
                        "\t\t요청하신 임시 비밀번호가 생성되었습니다.<br />"+
                        "\t\t아래 <b style=\"color: "+mainColor+";\">'임시 비밀번호'</b> 를 확인한 뒤, 임시 비밀번호로 로그인하세요.<br />"+
                        "\t\t감사합니다."+
                        "\t</p>"+
                        "\t<p style=\"font-size: 16px; margin: 40px 5px 20px; line-height: 28px;\">"+
                        "\t\t임시 비밀번호: <br />"+
                        "\t\t<span style=\"font-size: 24px;\">"+tempPassword+"</span>"+
                        "\t</p>"+
                        "\t<div style=\"border-top: 1px solid #DDD; padding: 5px;\">"+
                        "\t\t<p style=\"font-size: 13px; line-height: 21px; color: #555;\">"+
                        "\t\t\t만약 정상적으로 로그인 되지 않는다면, 다시 비밀번호를 받아주세요.<br />"+
                        "\t\t</p>"+
                        "\t</div>"+
                        "</div>";
        return template;
    }
}