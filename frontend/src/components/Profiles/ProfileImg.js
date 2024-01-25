import React from 'react'
import styled from "styled-components";

const ProfileImg = () => {

  return (
    <div>
      <Profile />
    </div>
    
  )
}

export default ProfileImg

const Profile = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-image: url("https://dthezntil550i.cloudfront.net/19/latest/192010230148434850013907406/cc56b1db-3707-4422-91a6-1a8d65867f92.png");
  background-size : cover;
`;