import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleButton = (props) => {
  const [isOn, setIsOn] = useState(false);
  
  const toggleHandler = () => {
    setIsOn(!isOn);
    props.setIsOn(!isOn)
  };

  return (
    <ToggleWrapper>
      <ToggleButtonLabel isOn={isOn} onClick={toggleHandler}>
        <ToggleButtonText isOn={isOn}>{isOn ? 'battle' : ''}</ToggleButtonText>
        <ToggleButtonCircle isOn={isOn} />
      </ToggleButtonLabel>
    </ToggleWrapper>
  );
};

export default ToggleButton;

const ToggleWrapper = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: beige ; */
`;

const ToggleButtonLabel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOn ? 'flex-end' : 'flex-start'};
  width: 70px;
  height: 25px;
  background-color: ${props => props.isOn ? 'blue' : 'lightgray'};
  border-radius: 25px;
  cursor: pointer;
  transition: justify-content 1s;
`;

const ToggleButtonText = styled.span`
  position: absolute;
  width: 100%;
  text-align: center;
  color: white;
  transition: transform 0.5s;
  transform: ${props => props.isOn ? 'translateX(-10px)' : 'translateX(10px)'};
`;

const ToggleButtonCircle = styled.div`
  width: 25px;
  height: 25px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.5s;
  transform: ${props => props.isOn ? 'translateX(5px)' : 'translateX(-5px)'};
`;