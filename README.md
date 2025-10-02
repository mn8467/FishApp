## 프로젝트 server 부분 세팅방법 ##
1. docker 설치
2. git pull origin master
3. docker-compose up --build
4. docker desktop 에서 서버 돌아가는지 확인
==> https://enchoboya.tistory.com/150 제 블로그 방문 ㄱ 여기에 설명 다 써있음
5. 확인했으면 VScode에 있는 Extensions가서 Remote Develoment 설치
6. 설치 후 Ctrl + Shift + p 누름
7. Dev Containers: Add Dev Container Configuration Files 선택
8. Node.js & TypeScript 선택
9. .devcontainer 에서 devcontainer.json 입력하는 파일 나옴
10. 밑에거 입력
{
  "name": "FishApp Backend Dev",
  "dockerComposeFile": ["C:\\Users\\mn846\\OneDrive\\Desktop\\FishApp\\server\\docker-compose.yml"],   // 같은 폴더면 이렇게만 씀
  "service": "backend",
  "workspaceFolder": "/server",
  "shutdownAction": "stopCompose",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker"
      ]
    }
  }
}

11. 이제 세팅 끝 서버 개발 가능 안되면 바로 연락주셔요

주의 : 프론트(Expo) 개발시에도 env 파일 필요함 총 2개 필요 디스코드에 올릴 예정이니 나중에 확인 ㄱㄱ

