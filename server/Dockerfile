# Layer 0: Node 베이스 이미지
FROM node:24-alpine

# Layer 1: 네이티브 모듈 빌드 도구 설치 (bcrypt, pg 대비)
RUN apk add --no-cache bash python3 make g++ postgresql-dev

# Layer 2: 컨테이너 작업 디렉토리
WORKDIR /server

# Layer 3: package.json + lock 파일만 복사 (캐시 최적화)
COPY package*.json ./

# Layer 4: 의존성 설치 (devDependencies 포함)
RUN npm ci

# Layer 5: 전체 소스 복사
COPY . .

# Layer 6: 개발환경 변수
ENV NODE_ENV=development

# Layer 7: 문서화용 포트 (Express 서버 포트)
EXPOSE 8080

# Layer 8: 개발용 실행 (nodemon + ts-node)
CMD ["npm", "run", "dev:watch"]
