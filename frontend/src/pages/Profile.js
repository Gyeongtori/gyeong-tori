import React from 'react'
import Header from '../components/Profiles/Header'
import SetProfile from '../components/Profiles/SetProfile';
import MyCard from '../components/Profiles/MyCard';
import styled from 'styled-components';


const Profile = () => {

  return (
    <Mobile>
      <Header />
      <SetProfile />
      <MyCard />

    </Mobile>
  )
}

export default Profile

const Mobile = styled.div`
  max-width: 400px;
  width: 100%;
  height: 100vh;
  /* margin-left: auto;
  margin-right: auto; */
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  margin: 2rem;

`;