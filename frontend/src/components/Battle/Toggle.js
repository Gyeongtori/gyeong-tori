import React, { useState } from 'react';
import styled from 'styled-components';

import { IoSettingsOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { GiHandBag } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import mapBtn from "../../assets/mapBtn.png";

const Toggle = () => {
  const [showSemiCircle, setShowSemiCircle] = useState(false);

  const navigate = useNavigate();
  
  const goProfile = () => {
    navigate("/profile");
  };

  const goCard = () => {
    navigate("/cards");
  };

  const goMap = () => {
    navigate("/maps");
  };

  return (
    <div>
      <ToggleBlock>
        <ToggleButton
          onClick={() => setShowSemiCircle(!showSemiCircle)}
        />
        <SemiCircle show={showSemiCircle}>
          <div>
            <SemiCircleButton>
              <LuMapPin onClick={goMap} size={35} />
            </SemiCircleButton>
          </div>
          <div>
            <SemiCircleButton>
              <GiHandBag onClick={goCard} size={35} />
            </SemiCircleButton>
            <SemiCircleButton>
              <IoSettingsOutline size={35} onClick={goProfile} />
            </SemiCircleButton>
          </div>
        </SemiCircle>
      </ToggleBlock> 
    </div>
  );
};

export default Toggle;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  z-index: 50;
  left: -35px;

  width: 70px;
  height: 70px;
  border-radius: 50%;

  background-image: url(${mapBtn});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
`;

const SemiCircle = styled.div`
  position: relative;
  bottom: -100px;
  transform: translateX(-50%)
    ${(props) => (props.show ? "translateY(0)" : "translateY(100%)")};
  width: 500px;
  height: ${(props) => (props.show ? "350px" : "0")};
  background: #9caf8888;
  border-radius: 100% 100% 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.7s ease-in-out;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};

  div:first-child {
    align-self: center;
  }

  div:last-child {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 80px;
  }
`;

const SemiCircleButton = styled.button`
  width: 80px;
  height: 80px;
  border: 1px solid #72a16f;
  background-color: #f0f4ef;
  border-radius: 50%;
  border: 2px solid #72a16f;
`;

const ToggleBlock = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
`;
