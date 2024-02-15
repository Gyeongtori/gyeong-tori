import styled from "styled-components";
import Header from "../components/Cards/Header";
import Search from "../components/Cards/Search";
import Card from "../components/Cards/Card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Frame = styled.div`
  display: flex;
  flex-direction: column;
`;

const Cards = () => {
  // let navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if(user===null){
      alert("로그인이 필요한 페이지 입니다")
      navigate("/maps")
    }
  })
  return (
    <>
      <Frame>
        {/* <Header /> */}
        {/* search 활성화 시 검색 페이지로 이동 */}
        {/* <div
          style={{ display: "flex" }}
          onClick={() => {
            navigate("/search");
          }}
        >
          <Search />
        </div> */}
        <Card />
      </Frame>
    </>
  );
};

export default Cards;
