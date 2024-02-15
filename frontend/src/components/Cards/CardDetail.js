import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GiAcorn } from "react-icons/gi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GrLinkPrevious, GrClose, GrLinkNext } from "react-icons/gr";
import { db } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #dfe7da;
`;
const Box = styled.div`
  margin: 20px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
`;
const Section = styled.div`
  flex: 1;
`;
const Title = styled.div`
  font-family: 'omyu_pretty';
  font-size: 2.5rem;

  text-align: center;
  /* font-size: 1.875rem; */
  font-weight: bold;
`;
const Grade = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  div {
    margin: 0 31.5px;
  }
`;
const CardImg = styled.div`
  width: 270px;
  height: 350px;
  border-radius: 5px;
  background-size: cover;
  background-image: url(${(props) => props.$cardImg});
`;
const Tags = styled.div`
  font-family: 'omyu_pretty';
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 8px;
  margin-right: 80%;
  /* width: fit-content; */
  border-radius: 20px 6px 6px 20px;
  /* height: 100%; */
  background-color: ${(props) =>
    props.$field === "ATTACK"
      ? "#ffca63"
      : props.$field === "HEAL"
      ? "#669b5d"
      : props.$field === "DEFENCE"
      ? "#4487d6"
      : props.$division === "11"
      ? "#BB9980"
      : props.$division === "12"
      ? "#B1D164"
      : props.$division === "13"
      ? "#9ED0D3"
      : null};
`;
const Des = styled.div`
  font-family: 'NanumSquareNeo-Variable';
  font-size: 1rem;
  line-height: 30px;
  letter-spacing: 1.7px;

  display: flex;
  justify-content: center;
  margin: 5px auto;
  width: 80%;
  padding: 10px;
  height: 40vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: #848484;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #848484;
  }
`;
const Dates = styled.div`
  font-family: 'NanumSquareNeo-Variable';

  display: flex;
  justify-content: flex-end;
  margin: 0 31.5px;
  div {
    align-items: center;
    padding: 8px;
    border-radius: 20px;
    background-color: white;
    color: black;
  }
  .div:hover {
    color: white;
    background-color: #9daf89;
  }
`;
const MoveBtn = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
  padding: 0.5rem 1rem;

  font-family: 'NanumSquareNeo-Variable';
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;

  display: inline-block;
  width: auto;

  border: none;
  border-radius: 4px;
  background: transparent;
`;
const CloseBtn = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 1px;
  padding: 0.5rem 1rem;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;

  display: inline-block;
  width: auto;

  border: 1px solid #cad6c0;
  background: #cad6c0;
  border-radius: 50%;
`;
const Footer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0px;
  width: 80%;
`;

// 획득일 팝업
const Blurs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
`;
const DateDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 60vw;
  height: 80vh;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 300;
`;
const CardDetail = (props) => {
  const [loading, setLoad] = useState(false);
  const [getGrade, setGrade] = useState(1);
  const [prevAble, setPrevAble] = useState(true);
  const [nextAble, setNextAble] = useState(false);
  const [getDate, setDate] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    const handleDetail = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setDate(false);
      }
    };
    document.addEventListener("mousedown", handleDetail);
    return () => {
      document.removeEventListener("mousedown", handleDetail);
    };
  }, [cardRef]);

  useEffect(() => {
    // console.log(db); // firebase 연결 테스트
    getImage();
    return () => {
      setLoad(false);
    };
  }, []);

  const getImage = async () => {
    const promises = props.card.grade_cards.map(async (card, index) => {
      const storage = getStorage();
      const imageUrl = await getDownloadURL(ref(storage, card.image));
      props.card.grade_cards[index].image = imageUrl;
      // cardImgs[index] = imageUrl;
      // console.log(cardImgs[index], cardImgs);
    });
    await Promise.all(promises);
    setLoad(true);
  };
  const ARRAY = [1, 2, 3, 4, 5];
  // console.log(props);
  const prev = () => {
    if (getGrade === 1) setPrevAble(true);
    else setGrade(getGrade - 1);
    if (getGrade - 1 === 0 || getGrade - 1 === 1) setPrevAble(true);
    else {
      setPrevAble(false);
      setNextAble(false);
    }
  };
  const next = () => {
    setGrade(getGrade + 1);
    if (getGrade + 1 === 5) setNextAble(true);
    else {
      setNextAble(false);
      setPrevAble(false);
    }
  };
  const getDates = () => {
    setDate(!getDate);
    console.log(props.card.grade_cards[getGrade - 1].holding_cards.length);
    console.log(props.card.grade_cards[getGrade - 1].holding_cards);
  };
  return (
    <>
      {loading && (
        <Frame>
          <Section>
            <Box>
              <Title>{props.card.cultural_heritage_name}</Title>
              <Grade>
                <div>
                  {ARRAY.map((index) =>
                    getGrade >= index ? (
                      <GiAcorn key={index} style={{ color: "#BB9981" }} />
                    ) : (
                      <GiAcorn key={index} style={{ color: "gray" }} />
                    )
                  )}
                </div>
              </Grade>
              {props.card.grade_cards[getGrade - 1] &&
                (props.card.grade_cards[getGrade - 1].holding_cards.length ===
                0 ? (
                  <>
                    <CardImg
                      style={{ backgroundSize: "contain" }}
                      $cardImg="https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                    ></CardImg>
                    <div style={{ marginTop: "5px" , fontFamily: 'NanumSquareNeo-Variable'}}>
                      <FaMapMarkerAlt />
                      카드를 수집해주세요.
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <CardImg
                        $cardImg={props.card.grade_cards[getGrade - 1].image}
                      ></CardImg>
                      <Tags style={{ top: "20px" }} $field={props.card.field}>
                        {props.card.field === "ATTACK"
                          ? "공격"
                          : props.card.field === "DEFENCE"
                          ? "수비"
                          : props.card.field === "HEAL"
                          ? "회복"
                          : null}
                      </Tags>
                      <Tags
                        style={{ top: "55px" }}
                        $division={props.card.division}
                      >
                        {props.card.division === "11"
                          ? "국보"
                          : props.card.division === "12"
                          ? "보물"
                          : props.card.division === "13"
                          ? "사적"
                          : null}
                      </Tags>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <FaMapMarkerAlt />
                      {props.card.address}
                    </div>
                  </>
                ))}
            </Box>
          </Section>
          <Dates>
            <div onClick={getDates}>획득일</div>
            {getDate && (
              <Blurs>
                <DateDetail ref={cardRef}>
                  {props.card.grade_cards[getGrade - 1] &&
                    (props.card.grade_cards[getGrade - 1].holding_cards
                      .length === 0 ? (
                      <div>아직 카드를 수집하지 못했습니다.</div>
                    ) : (
                      [...props.card.grade_cards[getGrade - 1].holding_cards]
                        .reverse()
                        .map((item) => <div>{item}</div>)
                    ))}
                </DateDetail>
              </Blurs>
            )}
          </Dates>
          {props.card.grade_cards[getGrade - 1] &&
          props.card.grade_cards[getGrade - 1].holding_cards.length === 0 ? (
            <Des>
              {props.card.address}에 도착하여 사진을 찍으면{" "}
              {props.card.cultural_heritage_name} 문화재 카드를 수집할 수
              있습니다.
            </Des>
          ) : (
            <Des>{props.card.description}</Des>
          )}

          <Footer>
            <MoveBtn onClick={prev} disabled={prevAble}>
              <GrLinkPrevious />
            </MoveBtn>
            <CloseBtn onClick={() => props.setDetail(false)}>
              <GrClose />
            </CloseBtn>
            <MoveBtn onClick={next} disabled={nextAble}>
              <GrLinkNext />
            </MoveBtn>
          </Footer>
        </Frame>
      )}
    </>
  );
};

export default CardDetail;
