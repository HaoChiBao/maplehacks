import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Doctor(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function submitForm(){
        console.log(email, password)
        
        // input true false clause here
        
        // true
        // redirect to doctor dashboard
        window.location.assign('/doctor/dashboard')

        // false
        // print error message (doctor not found)
    }

    return(
        <div>
            <h1>Sign In</h1>
            <input 
                type="text" 
                placeholder="email" 
                onChange={(e) => setEmail(e.target.value)}/>
            <input 
                type="password" 
                placeholder="password" 
                onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={submitForm}>Sign In</button>
        </div>
    )
}
export default Doctor