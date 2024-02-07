import React, { useState } from "react";
import Maps from "../../pages/Maps";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

export default function Capture(props) {
  console.log(props.url, props.state, props.isModalOpen);
  const url = props.url;
  const state = props.state;

    const navigate = useNavigate();

    const backMap = () =>{
        navigate(("/maps"))    
    }

  const handleDownload = (p) => {
    // 캡쳐된 이미지 데이터 URL을 이용하여 다운로드
    if (url) {
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "captured_image.png";

      // 다운로드 링크 클릭
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      alert("사진이 저장되었습니다.")
      backMap()
    } else {
      console.error("No captured image data to download.");
    }
  };


  const handleCloseModal = () => {
    // 모달 상태를 닫음
    props.setCaptureState(false);
    backMap()
  };


  return (
    <div>
      {props.captureState && (
        <div>
          <div>
            <button onClick={handleDownload}>사진저장하기</button>
            <button onClick={handleCloseModal}>닫기</button>
            {/* 닫기 버튼 추가 */}
            <div style={{ width: "300px", height: "642px" }}>
              {<img src={url} alt="Captured" />}
            </div>
          </div>
        </div>
      )}
      {/* 모달 상태가 true일 때만 모달을 렌더링 */}
    </div>
  );
}
