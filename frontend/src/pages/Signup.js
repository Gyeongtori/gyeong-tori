import React from 'react';

import ButtonFull from '../components/ButtonFull';
import ButtonBlank from '../components/ButtonBlank';
import Header from './../components/Profiles/Header';

const Signup = () => {
    return (
        <div>
            <Header />
            <p>이메일</p>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            >ssafy@gmail.com</ButtonBlank>
            
            <p>이메일</p>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            >ssafy@gmail.com</ButtonBlank>

            <p>이메일</p>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            >ssafy@gmail.com</ButtonBlank>

            <ButtonFull 
            color="#722D1E" 
            activecolor="#A94C36"
            >회원가입</ButtonFull>
            <p>이미 계정이 있으신가요? 로그인</p>
        </div>
    );
};

export default Signup;