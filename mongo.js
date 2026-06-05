const mongoose = require('mongoose') 

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://sahithirosy23_db_user:${password}@ac-v1ui4sb-shard-00-00.edh3don.mongodb.net:27017,ac-v1ui4sb-shard-00-01.edh3don.mongodb.net:27017,ac-v1ui4sb-shard-00-02.edh3don.mongodb.net:27017/?ssl=true&replicaSet=atlas-sqqze8-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family:4})

const contactSchema = new mongoose.Schema({
    id: String,
    name: String, 
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length === 3){ // print all the contacts in the phoneBook
    Contact.find().then(result =>{
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
    })
}else if(process.argv.length === 5){ // add the provided contact to the phoneBook and print a message to the console
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    contact.save().then(result => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
    })
}




