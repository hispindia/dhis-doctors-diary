import React,{propTypes} from 'react';

export function Login(props){

    function login(){

        // check if user already exist in cache

        
    }
    
    return (
            <div>
            <input type="text" placeholder="Username"></input>
            <input type="password" placeholder="Password"></input>
            
            <button onClick={login}>Sign In</button>
            </div>
    )
}
