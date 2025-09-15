const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('서버 설치 완료!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})