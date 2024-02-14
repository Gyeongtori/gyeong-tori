package org.jackpot.back.global.utils;

import lombok.NoArgsConstructor;

import java.util.Arrays;

@NoArgsConstructor
public class MaskUtils {
    /**
     * 한글 이름
     * - 이름의 두 번째 자리
     * - 네 자리 이상의 이름은 첫, 마지막 두자리 외
     * @param name
     * @return
     */
    public static String nameMaskKo(String name){
        String middleMask="";
        StringBuilder maskedName=new StringBuilder(name.substring(0,1));
        int nameLength=name.length();
        if(nameLength==2){
            maskedName.append("*");
        }else{
            middleMask=name.substring(1,nameLength-1);
            maskedName.append("*".repeat(middleMask.length()));
            maskedName.append(name.substring(nameLength-1));
        }
        return maskedName.toString();
    }

    /**
     * 영문 이름
     * 두 단어 이상으로 구성 : 앞 한 단어 이후
     * 한 단어로 구성 : 마지막 한자리
     * @param name
     * @return
     */
    public static String nameMaskEng(String name){
        StringBuilder maskedName=new StringBuilder();
        String[] names=name.split("\\s+");
        System.out.println(Arrays.toString(names));
        if(names.length==1){
            maskedName.append(name.substring(0, name.length()-1));
            maskedName.append("*");
        }else{
            maskedName.append(names[0]);
            for (int i = 1; i < names.length; i++) {
                maskedName.append(" ").append("*".repeat(names[i].length()));
            }
        }
        return maskedName.toString();
    }

    /**
     * 이메일 마스킹
     * - 5글자 이상의 이메일인 경우 앞 네자리 이후 마스킹
     * - 4글자 이하의 경우 앞 한 글자 이후 마스킹
     * @param email
     * @return
     */
    public static String emailMask(String email){
        String[] emailParts=email.split("@");
        StringBuilder maskedEmail=new StringBuilder();
        int emailLength=emailParts[0].length();
        if(emailLength<5){
            maskedEmail.append(emailParts[0].charAt(0));
            maskedEmail.append("*".repeat(emailLength-1));
        }else{
            maskedEmail.append(emailParts[0].substring(0,4));
            maskedEmail.append("*".repeat(emailLength-4));
        }
        maskedEmail.append("@");
        maskedEmail.append(emailParts[1]);
        return maskedEmail.toString();
    }

    /**
     * 비밀번호 마스킹
     * - 모든 글자 마스킹
     * @param password
     * @return
     */
    public static String passwordMask(String password){
        StringBuilder maskedPassword=new StringBuilder();
        maskedPassword.append("*".repeat(password.length()));
        return maskedPassword.toString();
    }

}
