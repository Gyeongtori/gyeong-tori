import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
// import ToryModel from './component/torymodel'
import './App.css'
import Camera from './component/Camera.jsx'


function App() {

  return (
    <div>
      <Canvas>
      <Camera/>
      </Canvas>
      {/* <ToryModel/> */}
    </div>
  )
}

export default App
