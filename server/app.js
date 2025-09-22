const express = require('express')
const cors = require('cors');

const app = express()
const port = 8080

app.use(cors({
  origin: 'http://localhost:8081', // 프론트엔드 주소
  credentials: true               // 쿠키/세션 허용
}));

app.use(express.json()); // JSON 본문 파싱
app.use(express.urlencoded({ extended: true })); // form-urlencoded 파싱

app.get('/api', (req, res) => {
  res.send('서버 설치 완료!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})