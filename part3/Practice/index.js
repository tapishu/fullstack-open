//const http = require("http"); //モジュールのimport
const express = require("express");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
//送られてきた JSON 形式のデータ（POST リクエストなどの本文）を 
// JavaScript のオブジェクトに自動で変換してくれる設定です

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  //「:変数」を使うことで可変の変数として扱える。以下リクエストでも使用可能。
  const id = request.params.id; //requestを介してオブジェクトにアクセス。
  //params は Express が用意してくれている「URL のコロン（:）で指定した変数たちをまとめて入れておく専用の箱（オブジェクト）」の名前
  const note = notes.find((note) => note.id === id);

  //未知のIDを入力すると200を返してしまうので、404を返すように変更
  if (note) {
    response.json(note); //responseを介して応答
  } else {
    response.status(404).end(); //データを送信せずにリクエストに応答するにはendメソッドを使用
  }
});

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})