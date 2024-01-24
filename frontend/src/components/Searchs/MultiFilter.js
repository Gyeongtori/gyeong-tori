import { useState } from "react";
import styled from "styled-components";

const TagBtn = styled.button`
  margin: 0px 5px 5px 5px;
  border: 1px solid black;
  border-radius: 10px;
  font-weight: bold;
  background-color: ${(props) => props.bg};
`;
const MultiFilter = ({ handleStatusChange }) => {
  const [filterState, setFilterState] = useState({
    passingTags: [
      {
        id: 11,
        status: false,
        color: "transparent",
        name: "국보",
      },
      {
        id: 12,
        status: false,
        color: "transparent",
        name: "보물",
      },
      {
        id: 13,
        status: false,
        color: "transparent",
        name: "사적",
      },
      {
        id: 14,
        status: false,
        color: "transparent",
        name: "사적및명승",
      },
      {
        id: 15,
        status: false,
        color: "transparent",
        name: "명승",
      },
      {
        id: 16,
        status: false,
        color: "transparent",
        name: "천연기념물",
      },
      {
        id: 17,
        status: false,
        color: "transparent",
        name: "국가무형문화재",
      },
      {
        id: 18,
        status: false,
        color: "transparent",
        name: "국가민속문화재",
      },
      {
        id: 21,
        status: false,
        color: "transparent",
        name: "시도유형문화재",
      },
      {
        id: 22,
        status: false,
        color: "transparent",
        name: "시도무형문화재",
      },
      {
        id: 23,
        status: false,
        color: "transparent",
        name: "시도기념물",
      },
      {
        id: 24,
        status: false,
        color: "transparent",
        name: "시도민속문화재",
      },
      {
        id: 25,
        status: false,
        color: "transparent",
        name: "시도등록문화재",
      },
      {
        id: 31,
        status: false,
        color: "transparent",
        name: "문화재자료",
      },
      {
        id: 79,
        status: false,
        color: "transparent",
        name: "국가등록문화재",
      },
      {
        id: 80,
        status: false,
        color: "transparent",
        name: "이북5도 무형문화재",
      },
    ],
  });

  const handleFilter = (e) => {
    const category = e.target.id;

    setFilterState((prevState) => {
      // prevState를 기반으로 새로운 passingTags를 생성
      const newPassingTags = prevState.passingTags.map((tag) => {
        // 현재 태그의 category에 해당하는 key가 있다면 값을 변경
        if (tag.id == category) {
          // 해당 category의 값 변경
          let bg = '';
          if(tag.status == false) {
            bg = "rgba(229, 154, 89, 100)";
          } else {
            bg = 'transparent';
          }
          return { ...tag, status: !tag.status, color: bg };
        }
        // category에 해당하는 key가 없으면 현재 태그 그대로 반환
        return tag;
      });

      // 부모 컴포넌트로 콜백 함수 호출
      handleStatusChange(newPassingTags);

      // 새로운 passingTags로 상태 업데이트
      return { passingTags: newPassingTags };
    });
  };
  
  return (
    <>
      {filterState.passingTags.map((val) => (
        <TagBtn id={val.id} bg={val.color} onClick={handleFilter}>
          {val.name}
        </TagBtn>
      ))}
    </>
  );
};

export default MultiFilter;
