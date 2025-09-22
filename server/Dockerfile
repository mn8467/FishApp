# Layer 0
FROM node:24-alpine 

# Layer 1 : 컨테이너 내부 작업 디렉토리 
WORKDIR /server 

# Layer 2 : package.json + lock 파일만 먼저 복사 (캐시 최적화) 
COPY package*.json ./ 

# Layer 3 : 개발용 의존성까지 모두 설치 
RUN npm ci 

# Layer 4 : 소스코드 복사 
COPY . . 

# Layer 5 : 개발용 실행 (ts-node-dev) 
CMD ["npm", "run", "dev"]