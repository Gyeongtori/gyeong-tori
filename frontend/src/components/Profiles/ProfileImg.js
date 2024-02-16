import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const ProfileImg = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const storage = getStorage()
  const fileRef = ref(storage, uuidv4())

  useEffect(() => {
    getDownloadURL(fileRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error('Error getting download URL:', error);
      });
  }, []);

  
  return (

    <div>
      <Profile />
      {imageUrl}
    </div>
    
  )
}

export default ProfileImg

const Profile = styled.div`
  border-radius: 50%;
  width: 4.5rem;
  height: 4.5rem;
  background-image: url("https://dthezntil550i.cloudfront.net/19/latest/192010230148434850013907406/cc56b1db-3707-4422-91a6-1a8d65867f92.png");
  background-size : cover;
`;