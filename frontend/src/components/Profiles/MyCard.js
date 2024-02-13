import React from 'react';
import styled from 'styled-components';

const MyCard = () => {
  return (
    <MyCardBlock>
      <MyCardTitle>수집한 카드</MyCardTitle>
      <MyCardInfos>
        <div>
          <div>전체 카드</div>
          <div>00개</div>
        </div>
        <div>
          <div>완성한 컬렉션</div>
          <div>00개</div>
        </div>
        <div>
          <div>수집한 카드</div>
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
  background-color: #DFE7DA; opacity: 0.5;
  margin: auto;
`;