import React from 'react';
import styled, { css } from 'styled-components';

import ButtonFull from '../components/ButtonFull';
import ButtonBlank from '../components/ButtonBlank';
import Header from './../components/Profiles/Header';

import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate()

    const goSignUp = () => {
        navigate('/login')
    }
    

    return (
        <div>
            <Header >  </Header>

            <h1>회원가입</h1>
            
            <InputText>이메일</InputText>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            placeholder='ssafy@gmail.com'
            ></ButtonBlank>
            
            <InputText>닉네임</InputText>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            placeholder='오뉴오뉴'
            ></ButtonBlank>

            <InputText>비밀번호</InputText>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            placeholder='*********'
            ></ButtonBlank>

            <InputText>비밀번호 확인</InputText>
            <ButtonBlank 
            color='#722D1E'
            activecolor='#A94C36'
            borderwidth='2'
            placeholder='*********'
            ></ButtonBlank>

            <SignupBtn>
                <ButtonFull
                color="#722D1E"
                activecolor="#A94C36"
                >회원가입</ButtonFull>
                <p>이미 계정이 있으신가요? <a onClick={goSignUp}>로그인</a></p>
            </SignupBtn>
        </div>
    );
};

export default Signup;

const InputText = styled.div`
  max-width: 400px;
  margin: 1.5rem 0rem 0rem 3rem;
  font-weight: bold;


  text-align: left;
`;

const SignupBtn = styled.div`
  margin-top: 5rem;
`;