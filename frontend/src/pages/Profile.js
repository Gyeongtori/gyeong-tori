import React, { useEffect } from 'react'
import styled from 'styled-components';
import Header from '../components/Profiles/Header'
import SetProfile from '../components/Profiles/SetProfile';
import MyCard from '../components/Profiles/MyCard';
import Settings from '../components/Profiles/Settings';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log('user: ', user);
  const navigate = useNavigate();

  useEffect(() => {
    if(user===null){
      alert("로그인이 필요한 페이지 입니다")
      navigate("/maps")
    }
  })
  
  return (
    <Mobile>
      <Header />
      <SetProfile />
      <MyCard />
      <MiddleLine></MiddleLine>
      <Settings />
    </Mobile>
  )
}

export default Profile

const Mobile = styled.div`
  font-family: 'NanumSquareNeo-Variable';
  max-width: 400px;
  width: 100%;
  height: 100vh;
  /* margin-left: auto;
  margin-right: auto; */

  /* background-color: #f2f2f2; */
  display: flex;
  flex-direction: column;
  margin: 2rem;


`;

const MiddleLine = styled.div`
  width: 150%;
  height: 0.8rem;
  transform: translateX(-20%);
  background-color: #DFE7DA;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-left: 100px;
`;