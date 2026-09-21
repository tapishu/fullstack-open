require('dotenv').config() //dotenv は、ノートモデルをインポートする前にインポートすることが重要


const express = require("express");
const app = express();
const morgan = require("morgan")
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')


app.use(express.static("dist"))
app.use(cors())

app.use(express.json())
//app.use(morgan("tiny"))//2. ミドルウェアとして登録


//Morgan に新しいログ項目（トークン）を自作して追加し、それを使ったカスタムフォーマットで出力する設定
morgan.token("body",(request) => { //bodyというトークン（変数を定義）
    return JSON.stringify(request.body) //POSTなどのbody付きリクエストが来るたびに呼ばれる。request.bodyを文字列化
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body') //:がついているのは全て変数
)

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/persons", (request, response) => {
//  response.json(persons);
Person.find({}).then(persons => {
    response.json(persons)
})
});

app.get("/api/persons/:id",(request, response)=>{
//     const id = request.params.id
//     const person = persons.find((p)=> p.id ===id)
//     console.log("pass")
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }
)
if (person){
    console.log("sucess")
    response.json(person)
} else{
    console.log("fail or nothing")
    response.status(404).end()
}

 
})

app.get("/info", (request, response) => {
    // const today = new Date()
    // const n = persons.length
Person.countDocuments({}).then(count =>{
const today = new Date()
      response.send(`
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${today}</p>
        </div>
      `)
    })
})

const generateId =() =>{
const randomId = Math.floor(Math.random() * 10000);
    return String(randomId)
}

app.post("/api/persons",(request,response) =>{
    const body =request.body

    if(!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    }
        if(!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const nameExist= persons.find((p)=> p.name===body.name)
        if(nameExist){
                  return response.status(400).json({
            error: 'that name is been registered'
        }) 
        }
    const person = {
        id:generateId(),
        name:body.name,
        number:body.number,
    }
    persons=persons.concat(person)
    response.json(person)
})

app.delete("/api/persons/:id",(request,response) =>{
const id = request.params.id
persons = persons.filter((p)=>p.id !==id)

response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
