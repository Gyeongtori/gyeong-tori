import React from 'react';
import styled, { css } from 'styled-components';

import ButtonFull from '../components/ButtonFull';
import ButtonBlank from '../components/ButtonBlank';


const Login = () => {
  return (
    <Main>
      <h1>TEST</h1>
      <Body>
        <h2>로그인</h2>
        <ButtonBlank 
          color='#E4E7EC'
          activecolor='#BCBCBD'
        >이메일</ButtonBlank>

        <ButtonBlank 
          color='#E4E7EC'
          activecolor='#BCBCBD'
        >비밀번호</ButtonBlank>

        <ButtonFull 
          color="#888870" 
          activecolor="#999966"
        >로그인하기</ButtonFull>

        <ButtonFull 
          color='#712E1E' 
          activecolor='#A94C36'
        >게스트로 입장하기</ButtonFull>

        <div>

        </div>
        <p>아직 회원이 아니신가요? 회원가입</p>
      </Body>
    </Main>
  );
}

export default Login;

const Main = styled.div`
  background-color: beige;

`

const Body = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  width: 100%;
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%);

  border-radius: 50px 50px 0px 0px;
  background-color: white;



  border: 1px solid black;

`;