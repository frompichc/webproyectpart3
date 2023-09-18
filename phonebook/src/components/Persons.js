import personService from '../services/persons'


const Persons = ( {persons, newFilter, setPersons, setNotification, setClassDiv} ) => {
    
    // delete information from database
    const DelPerson = (element) => {
        const message = `Delete ${element.name}`
        if (window.confirm(message)) {
            personService.delete(element._id).
            catch (error => {
                setClassDiv('error')
                setNotification(element.name + ' was already removed from the server')
                setTimeout(() => {
                    setNotification(null)
                },5000)
            })
            personService.getAll().then(response => setPersons(response.filter(person => person._id !== element._id)))
            setClassDiv('notification')
            setNotification(element.name + ' has been removed')
            setTimeout(() => {
                setNotification(null)
            }, 5000)   
        }
    }
    
    return (
        <div>
            <table>
                <tbody>
                        {persons.map((element) => { 
                        if (element.name.search(newFilter) !== -1 || element.name.length === 0) {
                            return (<tr key={element._id}>
                                <td>{element.name}</td>
                                <td>{element.number}</td>
                                <td><button onClick={() => DelPerson(element)}>Delete</button></td>
                            </tr>)
                        }
                        else return null
                    })}
                </tbody>
            </table>
        </div>
    )
}

export { Persons }