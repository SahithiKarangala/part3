require('dotenv').config()
const express = require('express')
const Contact = require('./models/contacts')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose') 

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
 

morgan.token('body', (request,response)=>{
    if (request.method == 'POST'){
        return JSON.stringify(request.body)
    }
    return ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let directory = []

const generateId = () =>{
    const maxId = directory.length>0 ? Math.max(... directory.map(p=>Number(p.id))) : 0
    return String(maxId + 1)
}


app.get('/api/persons', (request, response) => {
    Contact.find({}).then(directory =>{
        response.json(directory)
    })
})

app.get('/info',(request, response)=>{
    const date = new Date()
    response.send(`<p>Phonebook has info for ${directory.length} people</br> ${date}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const person = directory.find(p=>p.id === request.params.id)
    if(!person){
    return response.status(404).json({error: 'Person not found'})
    }
    response.json(person)
})

app.delete('/api/persons/:id',(request, response)=>{
    const id = request.params.id
    const directoryToBeDeleted = directory.find(p=>p.id === id)
    if(!directoryToBeDeleted){
        return response.status(404).json({error: 'Person not found'})
    }
    directory = directory.filter(p=>p.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request,response)=>{
    const body = request.body 
    if(!body.name || !body.number){
        return response.status(400).json({error: 'Name or number is missing'})
    }
    const nameExists = directory.find(p=>p.name === body.name)
    if(nameExists){
        return response.status(409).json({error: 'conatct already exists'})
    }
    const newContact = new Contact({
        id: generateId(),
        name: body.name,
        number: body.number
    })
    newContact.save().then(result => {
        response.json(result)
        console.log('added to contacts!')
    })
})

app.use((error, request, response, next)=>{
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})