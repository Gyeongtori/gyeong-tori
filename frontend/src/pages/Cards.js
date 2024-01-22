import styled from "styled-components";
import Header from "../components/Cards/Header";
import Search from "../components/Cards/Search";
import Card from "../components/Cards/Card";

let Mobile = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f2f2f2;
`;
const Cards = () => {
  return (
    <div>
      <Mobile>
        <Header />
        {/* search 활성화 시 검색 페이지로 이동해야함 */}
        <Search />
        <Card />
      </Mobile>
    </div>
  );
};

export default Cards;
