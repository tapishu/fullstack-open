const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI
//MONGODB_URI環境変数を介してアプリケーションに渡す
//MONGODB_URI="your_connection_string_here" npm run devのように使うらしい

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
//   id: String,
  //name: String,
  name :{
    type : String,
    minLength: 3,
    required : true
  },
  number: {
    type: String,
    minLength : 8,
    required : true,
    validate:{
      validator: function(v){
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: props => `${props.value} is invalid '09-1234567' or '040-1234567'`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)
