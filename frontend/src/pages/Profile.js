import React from 'react'
import styled from 'styled-components';
import Header from '../components/Profiles/Header'
import SetProfile from '../components/Profiles/SetProfile';
import MyCard from '../components/Profiles/MyCard';
import Settings from '../components/Profiles/Settings';


const Profile = () => {

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