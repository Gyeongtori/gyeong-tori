import React, { useEffect } from 'react'
import ProfileImg from './ProfileImg'
import styled from 'styled-components';

import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const SetProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    
    <InfoBlock>
      <ProfileImg />
      <ProfileBlock>
        <NameBlock>
          <NameContent>{user&&user.nickname}</NameContent>
          <RankContent>{user&&user.grade}두품</RankContent>
        </NameBlock>
        <SaveContent>
          <div>프로필 수정 </div>
          <IoIosArrowForward />
        </SaveContent>
      </ProfileBlock>
    </InfoBlock>
  )
}

export default SetProfile

const InfoBlock = styled.div`
  margin-top: 7rem;
  display: flex;
`;

const ProfileBlock = styled.div`
  width: 100%;
  margin: 0 0.6rem 0 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameBlock = styled.div`

`;

const NameContent = styled.div`
  font-size: 100%;
  font-weight: bold;
  margin-bottom: 0.2rem;
`;

const RankContent = styled.div`
  background-color: #9DAF89;
  color: white;
  width: 2.5rem;
  padding: 0.2rem;
  font-size: 0.8rem;
  text-align: center;
`;

const SaveContent = styled.div`
  color: #35573B;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
`;