//const http = require("http"); //モジュールのimport
require('dotenv').config() //dotenv は、ノートモデルをインポートする前にインポートすることが重要

const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const password = process.argv[2]
// const url = `mongodb+srv://fullstack:${password}@fullstack.adeo6hc.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstack`

// mongoose.set('strictQuery',false)
// mongoose.connect(url, { family: 4 })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// //IDやバージョン管理フィールドを表示させないためのフォーマット設定
// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

app.use(cors())
app.use(express.static('dist'))//distファイル内のindex.htmlを読み込み/に返す。以下に/で返す処理を記載してもここで返すため下まで行かない

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

// app.get("/api/notes", (request, response) => {
//   response.json(notes);
// });

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// app.get("/api/notes/:id", (request, response) => {
//   //「:変数」を使うことで可変の変数として扱える。以下リクエストでも使用可能。
//   const id = request.params.id; //requestを介してオブジェクトにアクセス。
//   //params は Express が用意してくれている「URL のコロン（:）で指定した変数たちをまとめて入れておく専用の箱（オブジェクト）」の名前
//   const note = notes.find((note) => note.id === id);

//   //未知のIDを入力すると200を返してしまうので、404を返すように変更
//   if (note) {
//     response.json(note); //responseを介して応答
//   } else {
//     response.status(404).end(); //データを送信せずにリクエストに応答するにはendメソッドを使用
//   }
// });

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
   if (note){
    response.json(note)
   } else{
            response.status(404).end()
   }
  })
  // .catch(error =>{
  //   console.log(error)
  //   //response.status(500).end
  //   response.status(400).send({error:"malformatted id"})
  // })
  .catch(error => next(error))
})

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

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     id: generateId(),
//   }
//   notes = notes.concat(note)
//   response.json(note)
 //})
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete("/api/notes/:id", (request, response, next) => {
 // const id = request.params.id;
  //notes = notes.filter((note) => note.id !== id);
Note.findByIdAndDelete(request.params.id).then(result =>{
    response.status(204).end();
}).catch(error => next(error))
});

app.put("/api/notes/:id", (request ,response, next) =>{
  const {content,important} = request.body

  Note.findById(request.params.id).then(note => {
    if(!note){
      return response.status(404).end()
    }
    note.content =content
    note.important = important
    return note.save().then((updatedNote) => {
      response.json(updatedNote)
    })
  })
  .catch(error => next(error))
})

//上記の関数は通貨した関数をみないのでエラーハンドルは下におく
//Expressのエラーハンドラは、 4つのパラメータを受け取る関数で定義されるミドルウェア
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})