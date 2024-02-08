import styled from "styled-components";
import Header from "../components/Cards/Header";
import Search from "../components/Cards/Search";
import Card from "../components/Cards/Card";
import { useNavigate } from "react-router-dom";

const Frame = styled.div`
  flex-direction: column;
`;

const Cards = () => {
  let navigate = useNavigate();
  return (
    <>
      <Frame>
        <Header />
        {/* search 활성화 시 검색 페이지로 이동해야함 */}
        <div
          onClick={() => {
            navigate("/search");
          }}
        >
          <Search />
        </div>
        <Card />
      </Frame>
    </>
  );
};

export default Cards;
