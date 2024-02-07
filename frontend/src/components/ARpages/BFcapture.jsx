
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>3D 모델 렌더링</title>
</head>

<body>
    <!-- 렌더링할 3D 모델을 표시할 캔버스 -->
    <canvas id="canvas" width="800" height="800"></canvas>

    <!-- 모듈 import를 위한 importmap 설정 -->
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.138.3/build/three.module.js",
                "GLTFLoader": "https://unpkg.com/three@0.141.0/examples/jsm/loaders/GLTFLoader.js"
            }
        }
    </script>

    <!-- JavaScript 모듈을 사용한 3D 렌더링 스크립트 -->
    <script type="module">
        // GLTFLoader 및 THREE 모듈을 import
        import * as THREE from 'three';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

        // 씬, 렌더러, 카메라 초기화
        let scene = new THREE.Scene();
        let renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#canvas'),
            antialias: true
        });
        renderer.outputEncoding = THREE.sRGBEncoding;

        let camera = new THREE.PerspectiveCamera(20, 1);
        camera.position.set(0, 0, 10)

        // 배경을 검은색으로 설정
        scene.background = new THREE.Color('black');

        // 빛 설정
        const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 주변 조명
        const directionalLight = new THREE.DirectionalLight(0xff0000, 1); // 방향 조명
        directionalLight.position.set(1, 1, 1).normalize(); // 조명의 위치

        // 씬에 빛 추가
        scene.add(ambientLight);
        scene.add(directionalLight);

        // GLTFLoader 인스턴스 생성
        const loader1 = new GLTFLoader();
        const loader2 = new GLTFLoader();
        const loader3 = new GLTFLoader();

        let xpos1 = Math.round(((Math.random() * (4 + 4)) - 4) * 1e2) / 1e2;
        let ypos1 = Math.round(((Math.random() * (4 + 4)) - 4) * 1e2) / 1e2;
        let beforexpos1 = xpos1;
        let beforeypos1 = ypos1;
        let sw1 = 3;
        let ysw1 = 1;
        let cnt1 = 0;
        let xrand1 = ((Math.random() * (4 + 4)) - 4).toFixed(1);
        let yrand1 = ((Math.random() * (4 + 4)) - 4).toFixed(1);

        let xpos2 = Math.round(((Math.random() * (10 + 10)) - 10) * 1e2) / 1e2;
        let ypos2 = Math.round(((Math.random() * (10 + 10)) - 10) * 1e2) / 1e2;
        let beforexpos2 = xpos2;
        let beforeypos2 = ypos2;
        let sw2 = 4;
        let ysw2 = 1;
        let cnt2 = 0;
        let xrand2 = ((Math.random() * (10 + 10)) - 10).toFixed(1);
        let yrand2 = ((Math.random() * (10 + 10)) - 10).toFixed(1);

        let mixer1; // mixer 변수를 외부에서 정의
        let model1; // model1 변수를 외부에서 정의

        let mixer2; // mixer 변수를 외부에서 정의
        let model2; // model2 변수를 외부에서 정의

        let mixer3; // mixer 변수를 외부에서 정의
        let model3; // model2 변수를 외부에서 정의

        // 3D 모델 로드 및 씬에 추가 (첫 번째 모델)
        loader1.load('low_poly_mugil/scene.gltf', function (gltf1) {
            model1 = gltf1.scene;

            // 위치, 회전 또는 필요한 다른 속성에 따라 조정
            model1.position.set(xpos1, ypos1, 0); // 예시 위치, 필요에 따라 조정
            model1.rotation.y -= 1.5;
            //model1.rotation.y -= 3.5;

            // 씬에 모델 추가
            scene.add(model1);

            // 애니메이션 등 추가 설정 가능

            const animations1 = gltf1.animations;
            mixer1 = new THREE.AnimationMixer(model1); // mixer 초기화

            // 모든 애니메이션을 믹서에 추가하고 재생
            animations1.forEach((animation) => {
                const action = mixer1.clipAction(animation);
                action.play();
            });

            animate(); // 애니메이션 시작
        });

        // 3D 모델 로드 및 씬에 추가 (두 번째 모델)
        loader2.load('koifish/scene.gltf', function (gltf2) {
            model2 = gltf2.scene;

            // 위치, 회전 또는 필요한 다른 속성에 따라 조정
            model2.position.set(-5, 2, -40); // 예시 위치, 필요에 따라 조정
            model2.rotation.y -= 3;

            // 씬에 모델 추가
            scene.add(model2);

            // 애니메이션 등 추가 설정 가능

            const animations2 = gltf2.animations;
            mixer2 = new THREE.AnimationMixer(model2); // mixer 초기화

            // 모든 애니메이션을 믹서에 추가하고 재생
            animations2.forEach((animation) => {
                const action = mixer2.clipAction(animation);
                action.play();
            });
            animate(); // 애니메이션 시작
        });

        // 애니메이션 업데이트 함수 정의
        function animate() {
            requestAnimationFrame(animate);

            if (mixer1) {
                mixer1.update(0.016); // 보통 60FPS(0.016) 기준으로 업데이트(조금 느리게)

                model1.position.set(0, 0, 0);
            }

            if (mixer2) {
                mixer2.update(0.016); // 보통 60FPS 기준으로 업데이트

                model2.position.set(5, 5, -40);
            }

            // 모든 모델에 대한 애니메이션 및 업데이트 작업 수행
            //console.log("HI");
            renderer.render(scene, camera);
        }
    </script>
</body>

</html>