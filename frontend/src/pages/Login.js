import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ButtonFull from "../components/Styles/ButtonFull";
import ButtonBlank from "../components/Styles/ButtonBlank";
import LanguageDropDown from "../components/Styles/LanguageDropDown";
import useStore from "../stores/store";

import { useNavigate } from "react-router-dom";
import axios from "axios";



const Login = () => {
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);

  const [language, setLanguage] = useState('Language');
  // console.log('language: ', language);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if(user){
      localStorage.removeItem('user')
    }
  }, [])

  
  const getUserInfo = async () => {
    try {
      const res = await axios.get("/v1/user/retrieve");
      // console.log('응답~~~~', res)
      if(res.status === 401) {
        useStore.getState().updateToken();
        getUserInfo()
      }
      const userInfo = res.data.data_body;
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };


  const handleLogin = async () => {
    if (email === "") {
      alert("이메일을 입력해주세요.");
    } else if (password === "") {
      alert("비밀번호를 입력해주세요.");
    } else {
      try {
        const res = await axios.post(`/v1/auth/login`, {
          email,
          password,
        });
        const status = res.data.data_header.result_code;
        if (status === "204 NO_CONTENT") {
          console.log("로그인 성공!");
          getUserInfo();
          
          // 메인으로 가기
          goMain();
        }
      } catch (error) {
        const status = error.res;
        if(status.statusText === 'Internal Server Error') {
          alert('아이디를 다시 확인해 주세요')
        }else if(status.statusText === 'Unauthorized'){
          alert('비밀번호를 다시 확인해 주세요')
        }else{
          navigate("/")
        }
      }
    }
  };

  

  const goSignUp = () => {
    navigate("/signup" ,  {state: { language }});
  };
  const goMain = () => {
    navigate("/maps",  {state: { language }});
  };

  return (
    <BodyBlock>
      {/* <div>???</div> */}
      <LanguageDropDown language={language} setLanguage={setLanguage} />
      <LoginBlock>
        <LoginTitle>{language==='English' ? "Log in": "로그인"}</LoginTitle>
        <ButtonBlank
          color="#E4E7EC"
          activecolor="#BCBCBD"
          placeholder={language==='English' ? "Email": "이메일"}
          onChange={(e) => setEmail(e.target.value)}
        ></ButtonBlank>
        <ButtonBlank
          color="#E4E7EC"
          activecolor="#BCBCBD"
          placeholder={language==='English' ? "Password": "비밀번호"}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></ButtonBlank>
        <ButtonFull onClick={handleLogin} color="#758467" activecolor="#9DAF89">
        {language==='English' ? "Log in": "로그인 하기"}
        </ButtonFull>
        <ButtonFull onClick={goMain} color="#9DAF89" activecolor="#758467">
        {language==='English' ? "Enter Guest": "게스트로 입장하기"}
        </ButtonFull>
        <p>
        {language==='English' ? "Not registered ": "아직 회원이 아니신가요? "}
          <span onClick={goSignUp} style={{ color: "#758467" }}>
          {language==='English' ? "Create an Account.": "회원가입."}
          </span>
        </p>
      </LoginBlock>
    </BodyBlock>
  );
};

export default Login;

const BodyBlock = styled.div`
  background-color: #dfe7da;
  width: 100%;
  height: 100vh;
  overflow: auto;

  font-family: "Nanum Gothic", sans-serif;
  font-weight: 400;
  font-style: normal;
`;

const LoginTitle = styled.div`
  margin: 0.8rem 0;
  font-weight: 700;
  font-size: 1.8rem; 
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
