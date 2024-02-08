let scene = new THREE.Scene();
        let renderer = new THREE.WebGLRenderer();
        // let loader = new THREE.GLTFLoader();
        // loader.load('../static/img/tory.gltf', function (gltf) {
        //     scene.add(gltf.scene);
        // });
        let loader = new GLTFLoader();
        loader.load('../static/img/tory.gltf', (gltf) => {
            this.scene.add(gltf.scene);
        });

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // 비디오와 비디오 스트림 변수 초기화
        this.video = document.createElement('video');
        this.videoStream = null; // 초기에는 비디오 스트림을 null로 설정

        // 카메라 초기 위치 설정
        this.camera.position.z = 7;

        // 비디오 텍스처 및 재질, 지오메트리 생성 및 메시에 적용
        this.videoTexture = new THREE.VideoTexture(this.video);
        const videoMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture });
        const videoGeometry = new THREE.PlaneGeometry(16, 9);
        this.videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
        this.scene.add(this.videoMesh);

        // 애니메이션 함수 정의
        const animate = () => {
            // 비디오 데이터가 충분히 확보되면 텍스처 업데이트
            if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                this.videoTexture.needsUpdate = true;
            }

            // 렌더링 및 다음 프레임 요청
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };

        // 애니메이션 시작
        animate();
    }

    // 웹캠 시작 함수
    startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            this.video.srcObject = stream;
            this.video.play();

            // 이전 웹캠 스트림 중지
            this.stopVideo();

            // 비디오 스트림 저장
            this.videoStream = stream;
        }).catch((error) => {
            console.error('Error accessing webcam:', error);
        });
    }

    // 웹캠 정지 함수
    stopVideo() {
        // 이전 웹캠 스트림 중지
        if (this.videoStream) {
            const tracks = this.videoStream.getTracks();
            tracks.forEach(track => track.stop());
        }
    }

    // 프론트/백 카메라 전환 함수
    switchCamera() {
        // 카메라 전환 로직 추가
        console.log('Switching camera...');
    }
}

// Three.js 및 XR 활성화 코드
const cs03Instance = new Cs03();

// 웹캠 시작 버튼 클릭 이벤트
document.getElementById('btn-front').addEventListener('click', () => {
    cs03Instance.startVideo();
});

// 후면 카메라 버튼 클릭 이벤트
document.getElementById('btn-back').addEventListener('click', () => {
    cs03Instance.stopVideo();
    cs03Instance.switchCamera();
});

// 창 크기 변경 이벤트 리스너
window.addEventListener('resize', () => {
    cs03Instance.camera.aspect = window.innerWidth / window.innerHeight;
    cs03Instance.camera.updateProjectionMatrix();
    cs03Instance.renderer.setSize(window.innerWidth, window.innerHeight);
});
