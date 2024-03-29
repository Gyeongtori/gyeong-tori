import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Capture(props) {
  console.log(props.url, props.state);
  const url = props.url;
  const state = props.state;
  const cultural_heritage_id = props.cultural_heritage_id;
  const address = state.address;

  const navigate = useNavigate();
  const backMap = async () => {
    try {
      await navigate("/maps");
      window.location.reload();
    } catch (error) {
      console.error("백으로 돌아갈 수 없어", error);
    }
  };

  const postAPI = async () => {
    try {
      const postData = {
        cultural_heritage_id: cultural_heritage_id,
        address: address,
      };
      const res = await axios.post(`/v1/card/add`, postData);
      console.log(res);
      console.log("정상적으로 실행되었습니다.");
    } catch (e) {
      console.log(e.response);
    }
  };

  const handleDownload = async () => {
    // 캡쳐된 이미지 데이터 URL을 이용하여 다운로드
    if (url) {
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "captured_image.png";

      // 다운로드 링크 클릭
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      await postAPI();
      backMap();
      alert("사진이 저장되었습니다.");
    } else {
      console.error("No captured image data to download.");
    }
  };
  const handleCloseModal = async () => {
    // 모달 상태를 닫음
    props.setCaptureState(false);
    await postAPI();
    backMap();
  };

  return (
    <div id="capture">
      {props.captureState && (
        <div>
      

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", height: "90%" }}>
              {
                <img
                  src={url}
                  alt="Captured"
                  style={{ width: "100%", height: "100%" }}
                />
              }
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{ marginRight: "10px", marginBottom: "10px" }}
              onClick={handleDownload}
            >
              사진저장하기
            </button>
            <button style={{ marginBottom: "10px" }} onClick={handleCloseModal}>
              닫기
            </button>
          </div>

        </div>
      )}
      {/* 모달 상태가 true일 때만 모달을 렌더링 */}
    </div>
  );
}
