import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import InfoTop from '../components/Mains/InfoTop';

// import { WiDaySnowWind } from "react-icons/wi";


const Main = () => {


  return (
    <Mobile>
      <InfoTop />

    </Mobile>
  )
  }

export default Main

const Mobile = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f2f2f2;
`;