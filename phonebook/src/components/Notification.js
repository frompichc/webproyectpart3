import React from 'react'

const Notification = ({notification, classDiv}) => {
    if (notification == null) {
        return null
    }
    return (
        <div className={classDiv}>
            {notification}
        </div>
    )

}

export { Notification }