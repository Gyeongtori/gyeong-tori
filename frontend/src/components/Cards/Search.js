import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { IoCloseOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
let SearchBar = styled.div`
  border-radius: 64px;
  border: solid 1px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 20px;
  padding: 5px;
  z-index: 1;
  opacity: 1;
  transition: border 0.3s ease;

  svg {
    color: rgba(128, 128, 128, 0.623);
    transition: color 0.3s ease;
  }
  &:focus-within svg {
    color: black;
  }
  &:focus-within {
  border: solid 1px rgba(0, 0, 0);
  }
`;
let SearchInput = styled.input`
  /* width: 50px; */
  border: none;
  /* text-align: center; */
  /* margin-left: 10px; */
  /* overflow: auto; */
  /* z-index: -1; */
  font-size: 15px;
  outline: none;
  /* width: 300px; */
  text-align: left;
  background-color: transparent;
`;
let ResetBtn = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 18px;
  }
`
const SearchTag = styled.button`
  svg {
    display : inline-flex;
    align-items: center;
    justify-content: center;
    width : 15px;
    height : 15px;
  }
  margin: 0px 5px 5px 15px;
  border: 1px solid black;
  border-radius: 10px;
  font-weight: bold;
  /* display: flex-row;
  justify-content: start; */
  display : inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg};
`
const Search = (props) => {
  let [text, setText] = useState('');
  let [resetBtn, setResetBtn] = useState(false);
  const inputRef = useRef(null);
  const locationNow = useLocation();
  let [category, setCategory] = useState([]);
  useEffect(() => {
    // '/search'에서만 컴포넌트가 마운트될 때 input 요소에 포커스 맞추기
    if (locationNow.pathname === '/search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // 빈 종속성 배열은 이 효과가 컴포넌트가 마운트될 때 한 번만 실행됨

  useEffect(() => {
    // '/search'에서만 컴포넌트가 마운트될 때 선택된 태그 값 가져오기
    if (locationNow.pathname === '/search') {
      // console.log(selectedTags);
      setCategory(props.filterState.passingTags.filter((tag) => tag.status === true))
    }
  }, [props.filterState] // filterState 값이 변경 될 때 실행
  );

  const handleEnter = (e) => {
    if(e.key === "Enter") {
      console.log(text, category);
    }
  }

  return (
    <>
    <SearchBar>
      <div>
      <FaSearch />
      <SearchInput
        ref={inputRef}
        type="text"
        placeholder="검색"
        value={text}
        onChange={(e) => {
          if(e.target.value.length >= 1) {
            setResetBtn(true);
          }else {
            setResetBtn(false);
          }
          setText(e.target.value);
          }}
        onKeyDown={handleEnter}
        />
      </div>
      {resetBtn ? <ResetBtn onClick={() => {
        setText('');
        setResetBtn(false);
      }}><TiDelete /></ResetBtn> : null}
    </SearchBar>
    <div>
    {category.length !== 0 ?
        category.map((val) => (
        <SearchTag 
          key={val.id} 
          id={val.id} 
          bg={val.color} 
          onClick={props.handleFilter}
        >
          {val.name}
          <IoCloseOutline id={val.id}/>
        </SearchTag>
      )) : <div style={{height: "28.3px"}}></div>}
    </div>
    </>
  );
};
export default Search;
