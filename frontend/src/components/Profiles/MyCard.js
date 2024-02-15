import React from 'react';
import styled from 'styled-components';
import useStore from "../../stores/store";



const MyCard = () => {
  const cardCount = useStore(state => state.cardCount);
  const listCount = useStore(state => state.listCount);
  console.log('listCount: ', listCount);
  return (
    <MyCardBlock>
      <MyCardTitle>수집한 카드</MyCardTitle>
      <MyCardInfos>
        <div>
          <MyCardInfosText>전체 카드</MyCardInfosText>
          <div>{cardCount}개</div>
        </div>
        <div>
          <MyCardInfosText>완성한 컬렉션</MyCardInfosText>
          <div>00개</div>
        </div>
        <div>
          <MyCardInfosText>수집한 카드</MyCardInfosText>
          <div>{listCount}개</div>
        </div>
      </MyCardInfos>



    </MyCardBlock>
  );
};

export default MyCard;


const MyCardBlock = styled.div`

`;

const MyCardTitle = styled.div`
  margin: 2rem 0 0.8rem 1.2rem;
`;

const MyCardInfos = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-around;
  background-color: rgb(223, 231, 218, 0.5);
  margin: auto;
  font-size: 15px;

  padding: 1rem 0;
  border-radius: 10px;
`;

const MyCardInfosText = styled.div`
  font-size: 0.9rem;
  padding-bottom: 0.5rem;
`;