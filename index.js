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
    Contact.find({}).then(directory => {
        const date = new Date()
        response.json(`Phonebook has info for ${directory.length} people. ${date}`)
    })
})

app.get('/api/persons/:id',(request,response,next)=>{

    Contact.findById(request.params.id).then(contact => {
        if(contact){
            response.json(contact)
        }else{
            reponse.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response, next)=>{
    const id = request.params.id
    Contact.findByIdAndDelete(id).then(result =>{
        response.status(204).end()
    }).catch(error=> next(error))
})

app.post('/api/persons',(request,response)=>{
    const body = request.body 
    if(!body.name || !body.number){
        return response.status(400).json({error: 'Name or number is missing'})
    }
    // const nameExists = directory.find(p=>p.name === body.name)
    // if(nameExists){
    //     return response.status(409).json({error: 'conatct already exists'})
    // }
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


app.put('/api/persons/:id',(req,res,next)=>{
    const {name, number} = req.body
    Contact.findById(req.params.id).then(result =>{
        if(!result){
            return res.status(404).json({error: 'contact not founf'})
        }

        result.name = name
        result.number = number

        return result.save().then(updatedContact =>{
            res.json(updatedContact)
        })
    }).catch(error => next(error))
})

const unknownEndpoint = (req,res)=>{
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req,res,next)=>{
    console.error(error.message) 

    if (error.name === 'CastError'){
        return res.status(400).send({error: 'malformed id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})