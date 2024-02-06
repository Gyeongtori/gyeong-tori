import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import ButtonFull from "../components/Styles/ButtonFull";
import ButtonBlank from "../components/Styles/ButtonBlank";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/store";
import Main from './Main';

const Login = () => {
  const navigate = useNavigate();
  // const { islogined, setIslogind, user, fetchUser } = useAuthStore()

  const [islogined, setIslogined] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // fetchUser();
    // localStorage.setItem('accessToken', '1dfadgadasadf25432346')
  }, []);

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
          // localStorage.accessToken ? setIslogined(true) : setIslogined(false)
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

    <Body>
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
        <ButtonFull onClick={handleLogin} color="#888870" activecolor="#999966" >
          로그인하기
        </ButtonFull>
        <ButtonFull onClick={goMain} color="#712E1E" activecolor="#A94C36" >
          게스트로 입장하기
        </ButtonFull>
        <p>
          아직 회원이 아니신가요? <span onClick={goSignUp} style={{ position: 'relative' }}>회원가입</span>
        </p>
      </LoginBlock>
    </Body>
  );
};

export default Login;


const LoginBlock = styled.div`
  background-color: beige;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  border-radius: 50px 50px 0px 0px;
  background-color: white;

  border: 1px solid black;
`;

const Body = styled.div`
  /* background-color: beige; */
`;