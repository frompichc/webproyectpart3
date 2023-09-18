import React from 'react'

const handleChange = (setValue) => (event) => setValue(event.target.value)

const Filter = ( {newFilter, setNewFilter}) => {
    return (
        <div>
            Filter shown with: <input
            value={newFilter}
            onChange={handleChange(setNewFilter)} />
        </div>
    )
}

export { Filter }