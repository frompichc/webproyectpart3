import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import { Filter } from './components/Filter'
import { Notification } from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState()
  const [newNumber, setNewNumber] = useState()
  const [newFilter, setNewFilter] = useState()
  const [notification, setNotification] = useState(null)
  const [classDiv, setClassDiv] = useState()
  
  useEffect(() => {
    personService.getAll().then(response => {
      setPersons(response)
    })
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} classDiv={classDiv}/>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      <h2>Add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons}
                  newName={newName} setNewName={setNewName}
                  newNumber={newNumber} setNewNumber={setNewNumber}
                  setNotification={setNotification} setClassDiv={setClassDiv}/>
      <h2>Numbers</h2>
        <Persons  persons={persons}
                newFilter={newFilter}
                setPersons={setPersons}
                setNotification={setNotification}
                setClassDiv={setClassDiv}/>
     </div>
  )
}

export default App