import { useState } from "react";
import styled from "styled-components";
import AllCard from "./AllCard";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
let Division = styled.span`
  display: inline-block;
  width: 50%;
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: bold;
  color: ${(props) => (props.$border ? "rgba(229, 154, 89, 100)" : "black")};
  border-bottom: solid 0.125rem
    ${(props) => (props.$border ? "rgba(229, 154, 89, 100)" : "black")};
`;
let Sorts = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 10px;
  color: rgba(128, 128, 128, 0.623);
  align-items: center;
`;
let Title = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
  }
`;
let Scroll = styled.div`
  display: flex;
  justify-content: flex-end;
  position: sticky;
  float: right;
  margin-right: 5px;
  bottom: 5%;
  z-index: 1;
`;
let TopBtn = styled.button`
  width: 35px;
  height: 35px;
  background-color: transparent;
  color: rgba(128, 128, 128, 0.623);
  border: 1px solid rgba(128, 128, 128, 0.623);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  &:hover {
    color: #9daf89;
  }
  svg {
    font-size: 20px;
  }
`;

const CheckBox = styled.div`
  input[id="collection"] {
    display: none;
  }
  input[id="collection"] + label {
    cursor: pointer;
  }
  input[id="collection"] + label > span {
    vertical-align: middle;
    padding-left: 5px;
    color: rgba(128, 128, 128, 0.623);
  }
  input[id="collection"] + label::before {
    content: "";
    display: inline-block;
    width: 17px;
    height: 17px;
    border: 2px solid rgba(128, 128, 128, 0.623);
    border-radius: 4px;
    vertical-align: middle;
  }
  input[id="collection"]:checked + label::before {
    content: "";
    background-color: rgba(128, 128, 128, 0.623);
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    font-size: 17px;
    width: 17px;
    height: 17px;
  }
`;

// 탑버튼
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Card = () => {
  // let [divis, setDivis] = useState(true);
  const [checked, setChecked] = useState(false);
  return (
    <>
      {/* <div>
        <Division
          $border={divis}
          onClick={() => {
            if (!divis) setDivis(!divis);
          }}
        >
          전체
        </Division>
        <Division
          $border={!divis}
          onClick={() => {
            if (divis) setDivis(!divis);
          }}
        >
          컬렉션
        </Division>
      </div> */}
      <div style={{ display: "flex" }}>
        <Sorts>
          <CheckBox>
            <input
              type="checkbox"
              id="collection"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
            <label htmlFor="collection">
              <span>내 컬렉션</span>
            </label>
          </CheckBox>
          <Title>
            기본순&nbsp;
            <IoChevronDownCircleOutline />
          </Title>
        </Sorts>
      </div>
      {!checked ? <AllCard /> : <div>컬렉션</div>}
      <Scroll>
        <TopBtn onClick={scrollToTop}>
          <FaArrowUp />
        </TopBtn>
      </Scroll>
    </>
  );
};
export default Card;
