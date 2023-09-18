import React from 'react'
import personService from '../services/persons'

const PersonForm = ( {persons, setPersons, newName, setNewName, newNumber, setNewNumber, setNotification, setClassDiv} ) => {
    //Verifies if is an add or an update
    const validateContact = (event) => {
        event.preventDefault()
        if (persons.find(value => value.name === newName)) {
            const updContact = persons.filter(person => person.name === newName)
            if (window.confirm(newName + ' is already to the phonebook, replace de old number with a new one?') ) {
                updateContact(updContact[0]._id)
            }
        } else {
            addContact()
        }
    }

    //Add a new contact
    const addContact = () => {
        const contactObject = {
            name: newName,
            number: newNumber
        }
        personService.create(contactObject).
        then(response => {
            if (!response._id) {
                console.log(response);
                setClassDiv('error')
                setNotification(response.message);
                setTimeout(() => {
                    setNotification(null)
                }, 5000)       
            } else {
                setPersons(persons.concat(response))
                setNewName('')
                setNewNumber('')
                setClassDiv('notification')
                setNotification('Added ' + newName)
                setTimeout(() => {
                    setNotification(null)
                }, 5000)       
            }
        })            
    }

    //updates an existing contact
    const updateContact = (id) => {
        const contactObject = {
            name: newName,
            number: newNumber
        }
        personService.update(id, contactObject).
        then(response => setPersons(persons.map(person => person._id !== id ? person: response))).
        catch(error => {
            setClassDiv('error')
            setNotification(newName + ' does not exist in the server')
            setTimeout(() => {
                setNotification(null)
            },5000)
        })
        setNewName('')
        setNewNumber('')
        setClassDiv('notification')
        setNotification(newName + ' has been modified')
        setTimeout(() => {
            setNotification(null)
        }, 5000)   
    }
     
    const handleChange = (setValue) => (event) => setValue(event.target.value)
  
    return (
        <form onSubmit={validateContact}>
        <table>
            <tbody>
                <tr>
                    <td>Name:</td>
                    <td>
                        <input 
                        value={newName}
                        onChange={handleChange(setNewName)}/>
                    </td>
                </tr>
                <tr>
                    <td>Phone number:</td>
                    <td>
                        <input 
                        value={newNumber}
                        onChange={handleChange(setNewNumber)}/>    
                    </td>
                </tr>
                <tr><td><button type="submit">add</button></td></tr>
            </tbody>          
        </table>
      </form>
    ) 
}

export { PersonForm }