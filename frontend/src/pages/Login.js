import React from 'react';
import styled from 'styled-components';

import Button from '../components/Button';


const Login = () => {
  return (
    <div>
      <div></div>
      <Mobile>
        <Button></Button>
        <Button></Button>
        <Button color="#888870" activecolor="#999966">로그인하기</Button>
        <Button color='#712E1E' activecolor='#A94C36'>게스트로 입장하기</Button>
      </Mobile>
    </div>
  );
}

export default Login;


const Mobile = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  width: 100%;
  position: fixed;
  bottom: 0;
`;