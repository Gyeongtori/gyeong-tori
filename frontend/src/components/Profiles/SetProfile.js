import React from 'react'
import ProfileImg from './ProfileImg'
import styled from 'styled-components';

const SetProfile = () => {
  return (
    
    <InfoBlock>
      <ProfileImg />
      <ProfileInfo>

      </ProfileInfo>
    </InfoBlock>
  )
}

export default SetProfile

const InfoBlock = styled.div`
  margin-top: 5rem;
  
`;

const ProfileInfo = styled.div`

`;