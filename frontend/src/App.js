import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Cards from "./pages/Cards";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Maps from "./pages/Maps";
import SearchPage from "./pages/SearchPage";
import BattlePage from "./pages/BattlePage";

import Camera from "./components/ARpages/arCamera";
import Test from "./pages/Test";

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
        <Route path="/cards" element={<Cards />} />
        <Route path="/main" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/camera" element={<Camera />} />
        <Route path="/test" element={<Test />} />
        <Route path="/battle" element={<BattlePage />} />
      </Routes>
    </div>
  );
}

export default App;
