import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Cards from "./pages/Cards";
import SearchPage from "./pages/SearchPage";

function App() {
   // PWA 적용을 위한 vh변환 함수
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
  }, []);

  return (
    <div className="App" id="App">
      <Routes>
        {/* <Route path="/" element={<MobileDiv />}> */}
          <Route path="/cards" element={<Cards />} />
          <Route path="/search" element={<SearchPage />} />
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
