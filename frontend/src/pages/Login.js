import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import ButtonFull from "../components/Styles/ButtonFull";
import ButtonBlank from "../components/Styles/ButtonBlank";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Main from './Main';

const Login = () => {
  const navigate = useNavigate();

  const [islogined, setIslogined] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handleLogin = async () => {
    if(email === "") {
      alert("이메일을 입력해주세요.");
    } else if (password === "") {
      alert("비밀번호를 입력해주세요.")
    } else {
      try {
        const response = await axios.post(`/v1/auth/login`, {
          email,
          password
        });
        const status = response.data.data_header.result_code;
        if(status === "204 NO_CONTENT") {
          setIslogined(true)
          console.log('로그인 성공!')
          localStorage.setItem('name', email)
          goMain()

          // localStorage.setItem('accessToken', response.data.accessToken);
          // localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      } catch(error) {
        const status = error.response.data.data_header
        if(status.result_code === 'NOT_EXISTS') {
          alert(status.result_message)
        }
      }
  }
  };

  const goSignUp = () => {
    navigate("/signup");
  };
  const goMain = () => {
    navigate("/maps");
  };




  return (
    <BodyBlock>
      {/* <div>???</div> */}
      <LoginBlock>
        <h2>로그인</h2>
        <ButtonBlank
          color="#E4E7EC"
          activecolor="#BCBCBD"
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        ></ButtonBlank>
        <ButtonBlank
          color="#E4E7EC"
          activecolor="#BCBCBD"
          placeholder="비밀번호"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></ButtonBlank>
        <ButtonFull onClick={handleLogin} color="#758467" activecolor="#9DAF89" >
          로그인하기
        </ButtonFull>
        <ButtonFull onClick={goMain} color="#9DAF89" activecolor="#758467" >
          게스트로 입장하기
        </ButtonFull>
        <p>
          아직 회원이 아니신가요? <span onClick={goSignUp} style={{ position: 'relative', color: '#758467'}}>회원가입</span>
        </p>
      </LoginBlock>
    </BodyBlock>

  );
};

export default Login;

const BodyBlock = styled.div`
  background-color: #DFE7DA;
  width: 100%;
  height: 100vh;
  overflow: auto;
`;

const LoginBlock = styled.div`
  background-color: beige;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  left: 0;
  border-radius: 50px 50px 0px 0px;
  background-color: white;
  

  /* border: 1px solid black; */
`;


