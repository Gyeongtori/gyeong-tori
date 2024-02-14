import React from 'react';
import styled from 'styled-components';

const MyCard = () => {
  return (
    <MyCardBlock>
      <MyCardTitle>수집한 카드</MyCardTitle>
      <MyCardInfos>
        <div>
          <MyCardInfosText>전체 카드</MyCardInfosText>
          <div>00개</div>
        </div>
        <div>
          <MyCardInfosText>완성한 컬렉션</MyCardInfosText>
          <div>00개</div>
        </div>
        <div>
          <MyCardInfosText>수집한 카드</MyCardInfosText>
          <div>00개</div>
        </div>
      </MyCardInfos>



    </MyCardBlock>
  );
};

export default MyCard;


const MyCardBlock = styled.div`

`;

const MyCardTitle = styled.div`
  margin: 2rem 0 0.5rem 1.2rem;
`;

const MyCardInfos = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-around;
  background-color: rgb(223, 231, 218, 0.5);
  margin: auto;

  padding: 1rem 0;
  border-radius: 10px;
`;

const MyCardInfosText = styled.div`
  font-size: 0.7rem;
  padding-bottom: 0.5rem;
`;