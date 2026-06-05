const mongoose = require('mongoose') 

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('connecting to', url)

mongoose.connect(url)
.then((result)=>{
    console.log('connected to MongoDB')
})
.catch((error)=>{
    console.log('error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
    id: String,
    name: String, 
    number: String
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)