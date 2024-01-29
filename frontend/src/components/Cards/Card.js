import { useState } from "react";
import styled from "styled-components";
import AllCard from "./AllCard";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
let Division = styled.span`
    display: inline-block;
    width: 50%;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    color: ${props => (props.border ? 'rgba(229, 154, 89, 100)' : 'black')};
    border-bottom: solid 2px ${props => (props.border ? 'rgba(229, 154, 89, 100)' : 'black')};
`
let SortTitle = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px;
  color: rgba(128, 128, 128, 0.623);
`
let Scroll = styled.div`
  position: fixed;
  /* right: 20%; */
  bottom: 5%;
  z-index: 1;
`
let TopBtn = styled.button`
  width: 40px;
  height: 40px;
  background-color: #fff;
  color:#000;
  border: 1px solid #000;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  &:hover{
    color: rgba(229, 154, 89, 100);
  }
  svg {
    font-size: 20px;
  }
`

// 탑버튼
const scrollToTop = () => {
  window.scrollTo({
    top:0,
    behavior: 'smooth'
  })
}

const Card = () => {
  let [divis, setDivis] = useState(true);
  
  return (
    <div>
      <div>
        <Division border={divis} onClick={() => {if(!divis)setDivis(!divis)}}>전체</Division>
        <Division border={!divis} onClick={() => {if(divis)setDivis(!divis)}}>컬렉션</Division>
      </div>
      <div>
        <SortTitle>기본순&nbsp;<IoChevronDownCircleOutline/></SortTitle>
      </div>
      {divis ? (<AllCard />):<div>컬렉션</div>}
      <Scroll>
        <TopBtn onClick={scrollToTop}><FaArrowUp /></TopBtn>
      </Scroll>
    </div>
  );
};
export default Card;
