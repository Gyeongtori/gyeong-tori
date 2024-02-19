import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import ButtonFull from "../components/Styles/ButtonFull";
import ButtonBlank from "../components/Styles/ButtonBlank";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";


import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // 랜덤 식별자를 생성해주는 라이브러리

const Signup = () => {

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    name: "",
    profile_img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });
  


  const [attachment, setAttachment] = useState();
 
  const onFileChange = (event) => {
    // 업로드 된 file
    const files = event.target.files;
    const theFile = files[0];
  //   if(theFile){
  //     setUserInput({profile_img :event.target.files[0],
  //       email: userInput.email,
  //       password: userInput.password,
  //       name: userInput.name,})
  // }
 
    // FileReader 생성
    const reader = new FileReader();
 
    // file 업로드가 완료되면 실행
    reader.onloadend = (finishedEvent) => {
      // 업로드한 이미지 URL 저장
      const result = finishedEvent.currentTarget.result;
      setAttachment(result);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);
  };
 

  const onSubmit = async (event) => {
    event.preventDefault();
    const storage = getStorage();
    const fileRef = ref(storage, uuidv4());
    const response = await uploadString(fileRef, attachment, 'data_url');
    console.log(response, '응답받은 onSubmit data');
    const url = await getDownloadURL(response.ref);
    setUserInput((prev) => ({ ...prev, profile_img: url }));
  };

  
  const [disApi, setDisApi] = useState();

  useEffect(() => {
    // 내근처 문화재만 탐색
    getDisAPI();
  }, []);

  const getDisAPI = async () => {
    try {
      const res = await axios.get(`v1/culturalheritage/list?language=EN`);
      console.log(res.data, '내 주변 문화재')
      let distanceAPI = res.data.data_body
      
      if (JSON.stringify(distanceAPI) !== JSON.stringify(disApi)){
        setDisApi(distanceAPI);
      }
      
    } catch (e) {
      console.log(e.response);
    }
  };
 
  const [checkPw, setCheckPw] = useState("");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  
  const fileInput = useRef(null)

  const onChange = (e) => {
    if(e.target.files[0]){
        setUserInput({profile_img :e.target.files[0],
          email: userInput.email,
          password: userInput.password,
          name: userInput.name,})
    }else{ //업로드 취소할 시
      setUserInput({profile_img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      email: userInput.email,
      password: userInput.password,
      name: userInput.name,
    })
        return
    }
    //화면에 프로필 사진 표시
      const reader = new FileReader();
      reader.onload = () => {
          if(reader.readyState === 2){
            setUserInput({profile_img:reader.result,
              email: userInput.email,
              password: userInput.password,
              name: userInput.name,
            })
          }
      }
      reader.readAsDataURL(e.target.files[0])
    }

  const emailCheck = (email) => {
    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return regExp.test(email);
  };

  const goSignIn = () => {
    navigate("/");
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
      checkPw === undefined ||
      checkPw !== userInput.password
    ) {
      alert("다시 입력해주세요.");
    } else {
      //   console.log(userInput);
      if (attachment) {
        const storage = getStorage();
        const fileRef = ref(storage, uuidv4());
        const response = await uploadString(fileRef, attachment, 'data_url');
        const url = await getDownloadURL(response.ref);
        setUserInput((prev) => ({ ...prev, profile_img: url }));
      }
      try {
        const res = await axios.post("v1/user/regist", userInput);
        const status = res.data.data_header.result_code;
        if (status === "204 NO_CONTENT") {
          alert("회원가입이 정상 등록 됐습니다. 로그인 해주세요.");
          navigate("/");
        }
      } catch (e) {
        console.log('e: ', e);
        const status = e.response.status;
        // console.log('alertMSG: ', alertMSG);
        // console.log('status: ', status);
        if (status === 500) {
          alert("서버오류!");
        } else if (status === 400) {
          console.log("오류!")
          // const alertMSG = e.response.data.data_header.result_message;
          // alert(alertMSG);
        }
      }
    }
  };

  return (
    <SignupBlock>

      <div style={{'marginBottom': '0.5rem'}}>
        <HiOutlineArrowNarrowLeft size='25' style={{marginBottom: '2rem'}}
        onClick={() => { navigate(-1); }}/>
        <TitleText>회원가입</TitleText >
        <TitleInfo>경토리에 회원가입 하시면</TitleInfo>
        <TitleInfo>더 많은 서비스를 즐기실 수 있습니다.</TitleInfo>
      </div>

      <ProfileIMG onSubmit={onSubmit}>
        
        <input
          type='file'
          // style={{display:'none'}}
          accept='image/jpg,impge/png,image/jpeg'
          name='profile_img'
          onChange={onChange}
          ref={fileInput}/>
          {attachment ? (
            <Avatar src={attachment} width="50px" height="50px" alt="" />
          ): <Avatar
          src={userInput.profile_img}
          style={{margin:'20px'}}
          size={200}
          />}
      </ProfileIMG>
     

      <InputText>이메일</InputText>
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
            profile_img: userInput.profile_img
          })
          if (!emailCheck(email)) {
            setEmailError("이메일 형식으로 입력해주세요."); 
          } else {
            setEmailError("");
          };
        }}
      ></ButtonBlank>
      {emailError && <ErrorMSG>{emailError}</ErrorMSG>}

      <InputText>닉네임</InputText>
      <ButtonBlank
        color="#CAD6C0"
        activecolor="#9DAF89"
        borderwidth="2"
        // placeholder="오뉴오뉴"
        onChange={(e) => {
          let name = e.target.value;
          setUserInput({
            email: userInput.email,
            password: userInput.password,
            name: name,
            profile_img: userInput.profile_img
          });
        }}
      ></ButtonBlank>

      <InputText>비밀번호</InputText>
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
            profile_img: userInput.profile_img
          });
        }}
      ></ButtonBlank>

      <InputText>비밀번호 확인</InputText>
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
        <ErrorMSG>비밀번호를 다시 확인해주세요.</ErrorMSG>
      ) : userInput.password !== "" ? (
        <ErrorMSG>Check!</ErrorMSG>
      ) : null}

      <SignupBtn>
        <ButtonFull color="#8CAB6E" activecolor="#819171" onClick={goSignUp}>
          회원가입
        </ButtonFull>
        <InfoText>
          이미 계정이 있으신가요? <span onClick={goSignIn} style={{ color: "#758467" }} >로그인</span>
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
`;

const TitleText = styled.div`
  margin: 0.5rem 0rem 0.5rem 0.5rem;
  font-weight: bold;
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

const Avatar = styled.img`
  width: 80px;
  height: 80px;
`;

const ProfileIMG = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;