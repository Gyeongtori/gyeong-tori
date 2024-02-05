import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene } from 'three.js';
import *as THREE from 'three'
// import Tory from "./Tory";

// const ToryModel = () => {
//     return (
//         <>
//             <OrbitControls />
//             <mesh>
//                 <Tory />
//                 <Mesh material={new MeshNormalMaterial()} />
//             </mesh>
//         </>
//     );
// }

// export default ToryModel;
let Scene = new THREE.Scene
let loader = new GLTFLoader();
loader.load("../model/tory.gltf", function (gltf) {
    scene.add(gltf.scene);
    animate();
}, undefined, function (error) {
    console.error('Error loading GLTF model:', error);
});