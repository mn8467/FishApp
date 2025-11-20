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

===========================================================================

같이하는 형님이 저번달말에 나가셨다.. 기록은 늦게나마 지금이라도 해둔다 근데 이제 완전 혼자해야한다
혼자서 일단 기능들을 계속 만들었는데 뭔가 내용이 유익한 것 같지도 않고 재밌는 것 같지도 않고 만들면서 이런저런 생각을 좀 해보다가 문득 내가 좋아하는 것과 관련된것을 하면 되겠다고 생각했다
그렇게 생각해낸게 내가 좋아하는 게임 관련 도감 or 팁 내용이 있는 어플이다.
마비노기 모바일을 출시부터 계속 해왔고 애착이 가는 게임이기 때문에 흥미가 없을 수 가 없다.
어제까지만 해도 의미 없이 기능만 대충 만들다가 오늘 아침부터 꼼꼼하게 구상해보기 시작했다.
일단 기존에 갖고있던 상어관련 데이터를 갈아 치우고 다른 데이터를 덮어쓰면 된다는 생각으로 새로 엑셀파일을 어플에 필요한 자료들을 보충하고 있다.
그리고 어느정도 필수 기능들은 거의 많이 만들어 놓은 상태이기 때문에 조금만 더 노력해서 완성해낼 생각이다 조바심 내지말고 내 페이스대로 가보자... 화이팅
- 2025.11.12 기록 -

주의 : 프론트(Expo) 개발시에도 env 파일 필요함 총 2개 필요 디스코드에 올릴 예정이니 나중에 확인 ㄱㄱ

===========================================================================
<필요 업데이트 사항>
- 클라이언트 부분
1. 아이디 틀렸을때 , 비밀번호 틀렸을때 트러블 슈팅 필요.
2. 댓글 입력, 수정 틀 자체 Youtube 처럼 수정 필요.
3. 마이페이지 => 뭘 보여줄 것인가?

- 서버 부분
1. 아이디, 비밀번호 둘중에 어떤게 틀린지 확인해서 에러코드 내보내야함

- 데이터 부분
1. fish 데이터 => 마비노기 모바일 데이터로 교체필요
2. 데이터 테이블 다시 만들어야함
3. 데이터 테이블 만들었으나 추가 할 데이터 필요
=> 추가 데이터 : 고유 스킬, 펫 설명 , 매력, 최대 레벨


