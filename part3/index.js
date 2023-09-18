const express = require('express')
const app = express()   
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./person');
const {BaseError } = require("./errors");

const requestLogger = ( jsonParser,(request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
})

app.use(requestLogger)
app.use(cors())
var jsonParser = bodyParser.json()

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      if (persons) {
        response.json(persons)
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
      if (error.name === "CastError" && error.kind === "ObjectId") {
        next(new BaseError('BAD REQUEST', 400, true, 'BAD REQUEST'));
      }
    })
  })

  app.get('/info', (request, response) => {
    Person.estimatedDocumentCount({}).then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>` +
        `<p>${new Date()}</p>`
      )      
    })
  })

  app.get('/api/persons/:id', jsonParser, (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
      
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
      if (error.name === "CastError" && error.kind === "ObjectId") {
        next(new BaseError('NOT FOUND', response.statusCode, true, 'ID DOES NOT EXIST'));
      }

    })
  })
  
    app.put('/api/persons/:id', jsonParser, (request, response, next) => {  
      const body = request.body
      if (!body.number) {
        next(new BaseError('BAD REQUEST', response.statusCode, true, 'MISSING FIELD: NUMBER'));
        response.status(200).json({message: 'MISSING FIELD: NUMBER'});
      } else {
        const person = {
          name: body.name,
          number: body.number,
        }
        Person.findByIdAndUpdate(request.params.id, person, {
          new: true
        }).then(updatedPerson =>{
          if (updatedPerson) {
            response.status(200).json(updatedPerson.toJSON());
          } else {
            response.status(404).end();
            next(new BaseError('NOT FOUND', response.statusCode, true, 'ID DOES NOT EXIST'));  
            response.status(200).json({message: 'ID DOES NOT EXIST'});
          }        
        })
        .catch(error => {
          response.status(400).end();
          next(new BaseError('BAD REQUEST', response.statusCode, true, 'INTERNAL ERROR WHEN UPDATING'));
        })
      }
    })

    app.delete('/api/persons/:id', (request, response, next) => {
      Person.findByIdAndRemove(request.params.id).then(deletePerson => {response.status(204).end()})
      .catch(error => {
        response.status(404).end();
        next(new BaseError('NOT FOUND', response.statusCode, true, 'ID DOES NOT EXIST'));
      })
      
    })

    
      app.post('/api/persons/', jsonParser, (request, response, next) => {
        const body = request.body;
        if (!body.name || !body.number) {
          next(new BaseError('BAD REQUEST', response.statusCode, true, 'MISSING FIELDS... NAME/NUMBER'));
          response.status(200).json({message:'MISSING FIELDS... NAME/NUMBER'});
        
        } else {
          const person = new Person ({
            name: body.name,
            number: body.number
          })
          person.save().then(result => {
            console.log(`Added ${person.name} number ${person.number} to phonebook`)
            response.status(200).json(result.toJSON())
          })
          .catch(error => {
            response.status(200).json(error);
          })
        }
      })

      const errorHandler = (error, request, response, next) => {
        console.error(error.message)
      
        if (error.name === 'CastError') {
          return response.status(400).send({ error: 'malformatted id' })
        } else if (error.name === 'ValidationError') {    return response.status(400).json({ error: error.message })  }
      
        next(error)
      }

      app.use(errorHandler);

//const PORT = 3001
const PORT = process.env.PORT || 3001 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)