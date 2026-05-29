const express = require('express')
const app = express()
app.use(express.json())

let directory = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () =>{
    const maxId = directory.length>0 ? Math.max(... directory.map(p=>Number(p.id))) : 0
    return String(maxId + 1)
}


app.get('/api/persons', (request, response) => {
    response.json(directory)
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
    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    directory = directory.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})