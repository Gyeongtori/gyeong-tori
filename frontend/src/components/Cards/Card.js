import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AllCard from "./AllCard";
import { db } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import MyCard from "./MyCard";
import CardDetail from "./CardDetail";
import Header from "./Header";
import Search from "./Search";
import axios from "axios";

let Sorts = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 10px;
  color: rgba(128, 128, 128, 0.623);
  align-items: center;
`;
let Title = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
  }
`;
let Scroll = styled.div`
  display: flex;
  justify-content: flex-end;
  position: sticky;
  float: right;
  margin-right: 5px;
  bottom: 5%;
  z-index: 1;
`;
let TopBtn = styled.button`
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(128, 128, 128, 0.623);
  border: 1px solid rgba(128, 128, 128, 0.623);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  &:hover {
    color: #9daf89;
  }
  svg {
    font-size: 20px;
  }
`;

const CheckBox = styled.div`
  input[id="collection"] {
    display: none;
  }
  input[id="collection"] + label {
    cursor: pointer;
  }
  input[id="collection"] + label > span {
    vertical-align: middle;
    padding-left: 5px;
    color: rgba(128, 128, 128, 0.623);
  }
  input[id="collection"] + label::before {
    content: "";
    display: inline-block;
    width: 17px;
    height: 17px;
    border: 2px solid rgba(128, 128, 128, 0.623);
    border-radius: 4px;
    vertical-align: middle;
  }
  input[id="collection"]:checked + label::before {
    content: "";
    background-color: rgba(128, 128, 128, 0.623);
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    font-size: 17px;
    width: 17px;
    height: 17px;
  }
`;

// 탑버튼
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Card = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoad] = useState(false);
  const [card, setCard] = useState([]); // 전체 카드 리스트(주소, 설명, 이미지주소, 등급 등등)
  const [list, setList] = useState([]); // 내 컬렉션 리스트
  const [getdetail, setDetail] = useState(false); // 카드 상세 설명 팝업 컴포넌트 열고 닫기
  const [cardId, setCardId] = useState(); // 카드 상세를 열기 위한 카드 id 값 넘기기
  let navigate = useNavigate();

  useEffect(() => {
    // console.log(db); // firebase 연결 테스트
    getCards();
    return () => {
      setLoad(false);
    };
  }, []);

  const getCards = async () => {
    try {
      const res = await axios.get("/v1/card/list");
      console.log(res);
      const data = await res.data.data_body;

      // Firebase Img 불러오기
      // const promises = res.data.data_body.card_list.map(async (card, index) => {
      //   const storage = getStorage();
      //   const imageUrl = await getDownloadURL(ref(storage, card.img));
      //   // console.log(imageUrl);
      //   cardImgs[index] = imageUrl;
      //   // console.log(cardImgs[index], cardImgs);
      // });
      // await Promise.all(promises);

      const listData = await data.filter((item) => item.have === true);
      setCard(data);
      setList(listData);
      // console.log(card);
      // console.log(list);
      setLoad(true);
    } catch (e) {
      console.log(e.response);
    }
  };
  return (
    <>
      {getdetail &&
        (!checked ? (
          <CardDetail setDetail={setDetail} card={card[cardId]} />
        ) : (
          <CardDetail setDetail={setDetail} card={list[cardId]} />
        ))}
      {!getdetail && (
        <>
          <Header />
          {/* search 활성화 시 검색 페이지로 이동 */}
          <div
            style={{ display: "flex" }}
            onClick={() => {
              navigate("/search");
            }}
          >
            <Search />
          </div>
          <div style={{ display: "flex" }}>
            <Sorts>
              <CheckBox>
                <input
                  type="checkbox"
                  id="collection"
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.target.checked);
                  }}
                />
                <label htmlFor="collection">
                  <span>내 컬렉션</span>
                </label>
              </CheckBox>
              <Title>
                기본순&nbsp;
                <IoChevronDownCircleOutline />
              </Title>
            </Sorts>
          </div>
          {loading ? (
            !checked ? (
              <AllCard
                checked={checked}
                card={card}
                setDetail={setDetail}
                setCardId={setCardId}
              />
            ) : (
              <MyCard
                checked={checked}
                card={list}
                setDetail={setDetail}
                setCardId={setCardId}
              />
            )
          ) : (
            <div>로딩중...</div>
          )}
          <Scroll>
            <TopBtn onClick={scrollToTop}>
              <FaArrowUp />
            </TopBtn>
          </Scroll>
        </>
      )}
    </>
  );
};
export default Card;
