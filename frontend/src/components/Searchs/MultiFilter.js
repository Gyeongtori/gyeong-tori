import { useState } from "react";
import styled from "styled-components";

const Tags = styled.div`
  margin: 20px;
`
const Title = styled.div`
  /* margin: 5px 0px 5px 20px; */
  text-align: left;
  font-weight: bold;
  font-size: large;
`
const TagBtn = styled.button`
  margin: 0px 5px 5px 0px;
  border: 1px solid black;
  border-radius: 10px;
  font-weight: bold;
  background-color: ${(props) => props.bg };
`;
const MultiFilter = (props) => {
  return (
    <Tags>
      <Title>
        카테고리
      </Title>
      <div>
      {props.filterState.passingTags
        .filter((tag) => tag.status === false)
        .map((val) => (
        <TagBtn key={val.id} id={val.id} bg={val.color} onClick={props.handleFilter}>
          {val.name}
        </TagBtn>
      ))}
      </div>
    </Tags>
  );
};

export default MultiFilter;
