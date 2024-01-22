import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
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
  justify-content: flex-start;
  align-items: center;
  svg {
    font-size: 18px;
  }
`
const Search = () => {
  let [text, setText] = useState('');
  let [resetBtn, setResetBtn] = useState(false);
  return (
    <SearchBar>
      <div>
      <FaSearch />
      <SearchInput
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
        />
      </div>
      {resetBtn ? <ResetBtn onClick={() => {
        setText('');
        setResetBtn(false);
      }}><TiDelete /></ResetBtn> : null}
    </SearchBar>
  );
};
export default Search;
