
// 씬(Scene), 카메라(Camera), 렌더러(Renderer) 생성
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 캐릭터 모델을 로드하기 위한 로더 생성
const loader = new GLTFLoader();

// 카메라 이동을 위한 OrbitControls 추가
const controls = new OrbitControls(camera, renderer.domElement);

// 카메라 초기 위치 설정
camera.position.z = 5;

// 캐릭터 모델 로드 및 씬에 추가
loader.load(
  'path/to/your/character/model.gltf',
  (gltf) => {
    const character = gltf.scene;
    scene.add(character);
  },
  undefined,
  (error) => {
    console.error('Error loading character model:', error);
  }
);

// 애니메이션 루프
const animate = () => {
  requestAnimationFrame(animate);

  // 카메라 이동 갱신
  controls.update();

  // 렌더링
  renderer.render(scene, camera);
};

// 창 크기 조절 이벤트 핸들러
const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 창 크기 조절 이벤트 리스너 등록
window.addEventListener('resize', handleResize);

// 애니메이션 루프 시작
animate();
