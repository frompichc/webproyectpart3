const mongoose = require('mongoose')

const url = 
`mongodb+srv://newuser:XXXXXX@persons.2ke4axd.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url).then(cnn => {
    console.log('Conected to MongoDB');
})
.catch(error => {
    console.error(error);
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true  
    } 
  })

  module.exports = mongoose.model('Person', personSchema);
