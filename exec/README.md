[링크](https://smiling-almandine-c61.notion.site/Porting-Manual-07c5563168834dfaac2023d0b0689c34?pvs=4)
## 목차

## 개발 환경

### 기술 스택

- CI/CD
    - AWS EC2
        - Ubuntu 20.04.6 LTS (GNU/Linux 5.15.0-1051-aws x86_64)
        - Docker 25.0.0
        - Docker compose 2.23.3
        - Jenkins 2.442
        - nginx 1.25.3
    - AWS RDS
    - Firebase Storage
- Database
    - MySQL
    - Redis 7.2.4
- Backend
    - IntelliJ 23.3.2(Ultimate Edition)
    - JWM OpenJDK 17.0.9
    - SpringBoot Gradle
    - [netty-socket.io](http://netty-socket.io) 2.0.8
- Frontend
    - VSCode 1.85.1
    - React 18.2.0
    - three 0.161.0
    - WebGL
    - Blender 4.0
    - socket.io-client 4.7.4

### 환경 변수

- git submodule을 통해 관리
    - 내부 파일 구조
        
        ```bash
        |   I10C107T.pem
        |   README.md
        |   test.txt
        |   toriTestServer.pem
        |   
        +---back
        |   |   .env
        |   |   application-blue.yml
        |   |   application-dev.yml
        |   |   application-green.yml
        |   |   application-prod.yml
        |   |   application.yml
        |   |   
        |   \---dump
        |           tori_test_db_card.sql
        |           tori_test_db_cultural_heritage.sql
        |           tori_test_db_holding_card.sql
        |           tori_test_db_problem.sql
        |           tori_test_db_users.sql
        |           
        \---front
                .env
                env.development
                env.production
        ```
        

### Jenkins

- frontend
    
    ```bash
    def component = [
            'front': true,
            'back': false,
            'nginx': false,
            'redis': false
    ]
    pipeline {
        agent any
        environment {
            REPO = "s10-webmobile1-sub2/S10P12C107"
        }
        stages {
            stage("Checkout") {
                steps {
                    checkout scmGit(
                            branches: [[name: 'develop-fe']],
                            extensions: [submodule(parentCredentials: true, trackingSubmodules: true)],
                            userRemoteConfigs: [[credentialsId: 'Github-access-token', url: 'https://github.com/KimDahui42/jackpot-settings']]
                    )
                }
            }
            stage('Copy backend .env File') {
                steps {
                    sh "ls backend/secure-settings"
                    // Git Submodule 내부의 .env 파일을 현재 작업 디렉토리로 이동
                    sh 'cp backend/secure-settings/back/.env .env'
                }
            }
            stage("Copy Env") {
                steps {
                    script {
                        sh 'ls -al'
                        // Git Submodule 내부의 ..env 파일을 현재 작업 디렉토리로 이동
                        sh 'cp backend/secure-settings/front/.env frontend/'
                    }
                }
            }
            stage("Build") {
                steps {
                    script {
                        sh "ls -al"
                        component.each { entry ->
                            if (entry.value) {
                                sh "docker compose -p test-server build ${entry.key.toLowerCase()}"
                            }
                        }
                    }
                }
            }
            stage("Login") {
                steps {
                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USER_ID', passwordVariable: 'DOCKER_USER_PASSWORD']]) {
                        sh """
                            set +x
                            echo $DOCKER_USER_PASSWORD | docker login -u $DOCKER_USER_ID --password-stdin
                            set -x
                        """
                    }
                }
            }
            stage("Tag and Push") {
                steps {
                    script {
                        component.each{ entry ->
                            if(entry.value){
                                def var = entry.key
                                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USER_ID', passwordVariable: 'DOCKER_USER_PASSWORD']]) {
                                    sh "docker push ${DOCKER_USER_ID}/toritest-${var.toLowerCase()}"
                                }
                            }
                        }
                    }
                }
            }
            stage('Prune old images'){
                steps{
                    script{
                        sh "docker image prune --filter until=1h"
                    }
                }
            }
            stage('Pull') {
                steps {
                    script {
                        component.each{entry ->
                            if(entry.value&&entry.key!="redis"){
                                def var = entry.key
                                sh "docker compose -p test-server pull ${var.toLowerCase()}"
                            }
                        }
                    }
                }
            }
            stage('Up') {
                steps {
                    script {
                        component.each{ entry ->
                            if(entry.value){
                                def var = entry.key
                                try {
                                    sh "docker compose -p test-server up -d ${var.toLowerCase()}"
                                } catch (Exception e) {
                                    // 'docker compose up -d' 명령이 실패한 경우
                                    echo "Failed to up. Starting 'docker compose start'..."
                                    sh "docker compose -p test-server restart ${var.toLowerCase()}"
                                }
                            }
                        }
                    }
                }
            }
        }
        post {
            always {
                script {
                    def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                    def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                    mattermostSend (color: currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger',
                            message: "빌드 ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                            endpoint: 'https://meeting.ssafy.com/hooks/q4qjarpscbf9pme4f46yiojzfe',
                            channel: 'C107-Jenkins'
                    )
                }
            }
        }
    }
    ```
    
- backend
    
    ```bash
    def component = [
            front: false,
            back: true,
            nginx: false,
            redis: false,
            certbot: false
    ]
    pipeline {
        agent any
        environment {
            REPO = "s10-webmobile1-sub2/S10P12C107"
        }
        stages {
            stage('Checkout') {
                steps {
                    checkout scmGit(
                            branches: [[name: 'develop-be']],
                            extensions: [submodule(parentCredentials: true, trackingSubmodules: true)],
                            userRemoteConfigs: [[credentialsId: 'Github-access-token', url: 'https://github.com/KimDahui42/jackpot-settings']]
                    )
                }
            }
            stage('Move ..env File') {
                steps {
                    // Git Submodule 내부의 .env 파일을 현재 작업 디렉토리로 이동
                    sh 'cp backend/secure-settings/back/.env .env'
                }
            }
            stage('Setup Environment') {
                steps {
                    dir("${env.WORKSPACE}/backend"){
                        script {
                            sh "ls . -al"
                            sh "chmod +x ./gradlew"
                            def version_value = sh(returnStdout: true, script: "./gradlew properties -q | grep 'version:'").trim()
                            version = version_value.split(/:/)[1].trim()
                            env.TAG = version
                            //이 명령은 현재 작업 디렉토리에 ..env 파일을 생성하고, 그 파일 안에 TAG라는 이름의 변수와 그 값을 씀.
                            //docker에 동적으로 tag를 지정하기 위해 사용했다.
                            sh "export TAG=$version"
                        }
                    }
                }
            }
            stage("Build") {
                steps {
                    script {
                        sh "ls -al"
                        component.each { entry ->
                            if (entry.value) {
                                sh "docker compose -p test-server build ${entry.key.toLowerCase()}"
                            }
                        }
                    }
                }
            }
            stage("Login") {
                steps {
                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USER_ID', passwordVariable: 'DOCKER_USER_PASSWORD']]) {
                        sh """
                            set +x
                            echo $DOCKER_USER_PASSWORD | docker login -u $DOCKER_USER_ID --password-stdin
                            set -x
                        """
                    }
                }
            }
            stage("Tag and Push") {
                steps {
                    script {
                        component.each{ entry ->
                            if(entry.value&&entry.key!="redis"&&entry.key!="certbot"){
                                def var = entry.key
                                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USER_ID', passwordVariable: 'DOCKER_USER_PASSWORD']]) {
                                    sh "docker push ${DOCKER_USER_ID}/toritest-${var.toLowerCase()}:${env.TAG}"
                                }
                            }
                        }
                    }
                }
            }
            stage('Prune old images'){
                steps{
                    script{
                        sh "yes | docker system prune --filter until=1h"
                    }
                }
            }
            stage('Pull') {
                steps {
                    script {
                        component.each{entry ->
                            if(entry.value&&entry.key!="redis"){
                                def var = entry.key
                                sh "docker compose -p test-server pull ${var.toLowerCase()}"
                            }
                        }
                    }
                }
            }
            stage('Up') {
                steps {
                    script {
                        component.each{ entry ->
                            if(entry.value){
                                def var = entry.key
                                try {
                                    sh "docker compose -p test-server up -d ${var.toLowerCase()}"
                                } catch (Exception e) {
                                    // 'docker compose up -d' 명령이 실패한 경우
                                    echo "Failed to up. Starting 'docker compose start'..."
                                    sh "docker compose -p test-server restart ${var.toLowerCase()}"
                                }
                            }
                        }
                    }
                }
            }
        }
        post {
            always {
                script {
                    def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                    def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                    mattermostSend (color: currentBuild.currentResult=='SUCCESS'?'good':'danger',
                            message: "빌드 ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                            endpoint: 'https://meeting.ssafy.com/hooks/q4qjarpscbf9pme4f46yiojzfe',
                            channel: 'C107-Jenkins'
                    )
                }
            }
        }
    }
    ```
    

### Dockerfiles

- front
    
    ```bash
    FROM node:lts-alpine as builder
    
    WORKDIR /front
    
    ENV PATH /front/node_modules/.bin:$PATH
    
    COPY package.json /front/package.json
    
    RUN npm install
    
    COPY . ./
    
    EXPOSE 4000
    ```
    
- back
    
    ```bash
    # 빌드 스테이지
    FROM amazoncorretto:17.0.7-alpine AS builder
    USER root
    WORKDIR /back
    COPY gradlew .
    COPY gradle gradle
    COPY build.gradle .
    COPY settings.gradle .
    COPY src src
    # gradlew 실행 권한 부여
    RUN chmod +x ./gradlew
    RUN ./gradlew bootJar
    
    # 실행 스테이지
    FROM openjdk:17
    WORKDIR /back
    COPY --from=builder /back/build/libs/*.jar app.jar
    ENTRYPOINT ["java", "-jar", "app.jar"]
    VOLUME /tmp
    
    EXPOSE 8080
    EXPOSE 8085
    ```
    
- jenkins
    
    ```bash
    FROM jenkins/jenkins:jdk17
    USER root
    
    ENV DEBIAN_FRONTEND noninteractive
    ENV DEBCONF_NOWARNINGS="yes"
    
    RUN apt-get -y update &&\
        apt-get install -y --no-install-recommends \
        vim \
        apt-utils
    
    RUN apt-get install ca-certificates curl gnupg lsb-release -y
    
    RUN mkdir -p /etc/apt/keyrings &&\
        curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg &&\
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null &&\
        apt-get -y update
    
    RUN apt-get install docker-ce docker-ce-cli containerd.io docker-compose docker-compose-plugin -y
    
    RUN if [ -e /var/run/docker.sock ]; then chown jenkins:jenkins /var/run/docker.sock; fi &&\
        usermod -aG docker jenkins
    
    RUN apt install sudo
    
    USER jenkins
    
    EXPOSE 8080
    ```
    
- nginx
    
    ```bash
    FROM nginx:latest
    
    RUN rm -rf /etc/nginx/conf.d/default.conf
    COPY nginx.conf /etc/nginx/nginx.conf
    
    RUN apt-get update
    RUN apt-get upgrade
    RUN apt-get install pythone3-certbot-nginx
    
    CMD ["nginx", "-g", "daemon off;"]
    ```
    

### Nginx & Docker & Certbot SSL 인증

- docker-compose.yml
    
    ```yaml
    version: '3.8'
    
    services:
      certbot:
        container_name: certbot
        image: certbot/certbot
        restart: unless-stopped
        volumes:
          - ./certbot/conf:/etc/letsencrypt:rw
          - ./certbot/www:/var/www/certbot:rw
        depends_on:
          - nginx
    
      nginx:
        container_name: nginx
        image: kimdahui/toritest-nginx:${TAG}
        build:
          context: nginx
          dockerfile: Dockerfile
        restart: unless-stopped
        ports:
          - "80:80"
          - "443:443"
        networks:
          - jenkins-network
        volumes:
          - ./certbot/conf:/etc/letsencrypt:ro
          - ./certbot/www:/var/www/certbot:ro
    
      front:
        container_name: front
        image: kimdahui/toritest-front
        build:
          context: frontend
          dockerfile: Dockerfile
        restart: always
        command: npm start
        ports:
          - "3000:3000"
        networks:
          - jenkins-network
    
      back:
        container_name: back
        image: kimdahui/toritest-back:${TAG}
        build:
          context: backend
          dockerfile: Dockerfile
        restart: unless-stopped
        ports:
          - "8080:8080"
          - "8085:8085"
        networks:
          - jenkins-network
        environment:
          - "SPRING_PROFILES_ACTIVE=prod"
     
      redis:
        container_name: redis
        hostname: redis
        image: redis:alpine
        restart: unless-stopped
        networks:
          - jenkins-network
        volumes:
          - ~/redis/data:/data
        user: root
        command: redis-server --requirepass ${REDIS_PASSWORD}
        ports:
          - "6379:6379"
    
    networks:
      jenkins-network:
        external: true
    ```
    
- redirect 80 to 443 `nginx`
    
    ```yaml
    server {
            listen 80;
            server_name i10c107.p.ssafy.io;
            server_tokens off;
    
            location /.well-known/acme-challenge/ {
                allow all;
                root /var/www/certbot;
            }
            return 301 https://$host$request_uri;
        }
    ```
    
- nginx.conf
    
    ```yaml
    worker_processes auto;
    events { worker_connections 8192; }
    
    http {
        limit_req_zone $binary_remote_addr zone=limit_request_per_ip:10m rate=10r/s;
    
        map $http_user_agent $bad_bot {
            default 0;
            ~*(^MJ12bot|^MJ12bot/v1.4.5|SemrushBot|SemrushBot-SA|DomainCrawler|MegaIndex.ru|AlphaBot|Paros|ZmEu|nikto|dirbuster|sqlmap|openvas|w3af|Morfeus|Zollard|Arachni|Brutus|bsqlbf|Grendel-Scan|Havij|Hydra|N-Stealth|Netsparker|Pangolin|pmafind|webinspect) 1;
        }
    #     upstream back-api {
    #       server blue:8082;
    #     }
        server {
            listen 80;
            server_name i10c107.p.ssafy.io;
            server_tokens off;
    
            location /.well-known/acme-challenge/ {
                allow all;
                root /var/www/certbot;
            }
            return 301 https://$host$request_uri;
        }
    
        server {
            listen 443 ssl;
            server_name i10c107.p.ssafy.io;
    
            ssl_certificate /etc/letsencrypt/live/i10c107.p.ssafy.io/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/i10c107.p.ssafy.io/privkey.pem;
    
            location / {
                # 나쁜 봇을 차단
                if ($bad_bot) {
                    return 403;
                }
                # app 서비스로 라우팅
                proxy_pass http://front:3000/;
                proxy_redirect off;
    
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
    
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
            location /thayoon/ {
                # 나쁜 봇을 차단
                if ($bad_bot) {
                    return 403;
                }
                # app 서비스로 라우팅
                proxy_pass http://front-tiki:4000/;
                proxy_redirect off;
    
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                try_files $uri $uri/ /index.html;
            }
            location /api/ {
                # 나쁜 봇을 차단
                if ($bad_bot) {
                    return 403;
                }
    
                # app 서비스로 라우팅
                proxy_pass http://back:8080/;
                proxy_redirect off;
    
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Prefix /api/;
            }
            location /socket.io/ {
                # socket 포트로 라우팅
                proxy_pass http://back:8085/socket.io/;
    
                proxy_set_header X-NginX-Proxy false;
                proxy_set_header Origin "";
                proxy_redirect off;
    
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
    
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
        }
    }
    ```
    
- cert, nginx build
    - docker compose up
        
        jenkins pipline이 아닌 서버에서 직접 실행했다. 
        
        ```yaml
        docker-compose -p {프로젝트 명} run --rm {컨테이너 이름, certbot} \
        certonly --webroot --webroot-path /var/www/certbot/ -d {인증할 도메인}
        ```
