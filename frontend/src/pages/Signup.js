import React, { useRef, useState } from "react";
import styled from "styled-components";

import ButtonFull from "../components/Styles/ButtonFull";
import ButtonBlank from "../components/Styles/ButtonBlank";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const location = useLocation();
  const language = location.state.language;
  // console.log('language: ', language);

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    name: "",
    // profile_img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });
  const [checkPw, setCheckPw] = useState("");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  
  const fileInput = useRef(null)

  // const onChange = (e) => {
  //   if(e.target.files[0]){
  //       setUserInput({profile_img :e.target.files[0],
  //         email: userInput.email,
  //         password: userInput.password,
  //         name: userInput.name,})
  //         }else{ //업로드 취소할 시
  //           setUserInput({profile_img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //           email: userInput.email,
  //           password: userInput.password,
  //           name: userInput.name,
  //         })
  //             return
  //         }
  //   //화면에 프로필 사진 표시
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //             if(reader.readyState === 2){
  //               setUserInput({profile_img:reader.result,
  //                 email: userInput.email,
  //                 password: userInput.password,
  //                 name: userInput.name,
  //               })
  //             }
  //         }
  //         reader.readAsDataURL(e.target.files[0])
  //     }

  const emailCheck = (email) => {
    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return regExp.test(email);
  };

  const goSignIn = () => {
    navigate("/", { state: { language } });
  };

  const goSignUp = async () => {
    if (
      userInput.email === "" ||
      userInput.email === undefined ||
      userInput.password === "" ||
      userInput.password === undefined ||
      userInput.name === "" ||
      userInput.name === undefined ||
      checkPw === "" ||
      checkPw === undefined
    ) {
    alert(language === 'English' ? "Please enter again." : "다시 입력해주세요.");
  } else if(
    !emailCheck(userInput.email)
  ) {
    alert(language === 'English' ? "Please enter in email format." : "이메일 형식으로 입력해 주세요.");
  } else if(
    checkPw !== userInput.password
  ){
    alert(language === 'English' ? "Please check your password again." : "비밀번호를 다시한번 확인해 주세요");
  } else {
      //   console.log(userInput);
      try {
        const res = await axios.post("/v1/user/regist", userInput);
        const status = res.data.data_header.result_code;
        if (status === "204 NO_CONTENT") {
          alert(language === 'English' ? "Registration completed successfully. Please log in." : "회원가입이 정상 등록 됐습니다. 로그인 해주세요.");
          navigate("/", { state: { language } });
        }
      } catch (e) {
        console.log('e: ', e);
        const status = e.response.status;
        const alertMSG = e.response.data.data_header.result_message;
        if (status === 500) {
          alert(language === 'English' ? "Server error!" : "서버오류!");
        } else if (status === 400) {
          alert(language === 'English' ? alertMSG : alertMSG);
        }
      }      
    }
  };

  return (
    <SignupBlock>

    <div style={{'margin-bottom': '0.5rem'}} >
      <HiOutlineArrowNarrowLeft size='25' style={{marginBottom: '2rem'}}
      onClick={() => { navigate(-1); }}/>
      <TitleText>{language === 'English' ? "Sign Up" : "회원가입"}</TitleText >
      <TitleInfo>{language === 'English' ? "Sign up for Kyungtory and" : "경토리에 회원가입 하시면"}</TitleInfo>
      <TitleInfo>{language === 'English' ? "enjoy more services." : "더 많은 서비스를 즐기실 수 있습니다."}</TitleInfo>
    </div>

      {/* <Avatar 
        src={userInput.profile_img} 
        style={{margin:'20px'}} 
        size={200} 
        />
      <input 
        type='file' 
        // style={{display:'none'}}
        accept='image/jpg,impge/png,image/jpeg' 
        name='profile_img'
        onChange={onChange}
        ref={fileInput}/>
      */}

      <InputText>{language === 'English' ? "Email" : "이메일"}</InputText>
      <ButtonBlank
        color="#CAD6C0"
        activecolor="#9DAF89"
        borderwidth="2"
    
        // placeholder='ssafy@gmail.com'
        onChange={(e) => {
          let email = e.target.value;
          setUserInput({
            email: email,
            password: userInput.password,
            name: userInput.name,
          })
          if (!emailCheck(email)) {
            setEmailError(language === 'English' ? "Please enter in email format." : "이메일 형식으로 입력해 주세요"); 
          } else {
            setEmailError("");
          };
        }}
      ></ButtonBlank>
      {emailError && <ErrorMSG>{emailError}</ErrorMSG>}

      <InputText>{language === 'English' ? "Nickname" : "닉네임"}</InputText>
      <ButtonBlank
        color="#CAD6C0"
        activecolor="#9DAF89"
        borderwidth="2"

        onChange={(e) => {
          let name = e.target.value;
          setUserInput({
            email: userInput.email,
            password: userInput.password,
            name: name,
          });
        }}
      ></ButtonBlank>

      <InputText>{language === 'English' ? "Password" : "비밀번호"}</InputText>
      <ButtonBlank
        color="#CAD6C0"
        activecolor="#9DAF89"
        borderwidth="2"
        // placeholder="*********"
        type="password"
        onChange={(e) => {
          let password = e.target.value;
          setUserInput({
            email: userInput.email,
            password: password,
            name: userInput.name,
          });
        }}
      ></ButtonBlank>

      <InputText>{language === 'English' ? "Confirm Password" : "비밀번호 확인"}</InputText>

      <ButtonBlank
        color="#CAD6C0"
        activecolor="#9DAF89"
        borderwidth="2"
        // placeholder="*********"
        type="password"
        onChange={(e) => {
          let pw = e.target.value;
          setCheckPw(pw);
        }}
      ></ButtonBlank>
      {userInput.password !== checkPw ? (
          <ErrorMSG>{language === 'English' ? "Please check your password again." : "비밀번호를 다시 확인해주세요."}</ErrorMSG>
      ) : userInput.password !== "" ? (
        <ErrorMSG>Check!</ErrorMSG>
      ) : null}

    <SignupBtn>
      <ButtonFull color="#8CAB6E" activecolor="#819171" onClick={goSignUp}>
        {language === 'English' ? "Sign Up" : "회원가입"}
      </ButtonFull>
      <InfoText>
        {language === 'English' ? "Already have an account? " : "이미 계정이 있으신가요? "}
        <span onClick={goSignIn} style={{ color: "#758467" }}>
          {language === 'English' ? "Log in" : "로그인"}
        </span>
      </InfoText>
    </SignupBtn>
    </SignupBlock>
  );
};

export default Signup;

const SignupBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  font-family: "Nanum Gothic", sans-serif;
  font-weight: 400;
  font-style: normal;
`;

const TitleText = styled.div`
  margin: 0.5rem 0rem 0.5rem 0.5rem;
  font-weight: 700;
  font-size: 1.5rem; 
  text-align: left;

`;

const TitleInfo = styled.div`
  margin-left: 0.5rem;
  font-size: 0.8rem; 

`;

const InputText = styled.div`
  margin-left: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  text-align: left;
`;

const SignupBtn = styled.div`
  margin-top: 2rem;
  `;

const InfoText = styled.div`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ErrorMSG = styled.div`
  color: red;
  font-size: 0.7rem;
  margin: 0.3rem 0 0 1rem;
`;

// const Avatar = styled.img`
//   width: 50px;
//   height: 50px;
// `;