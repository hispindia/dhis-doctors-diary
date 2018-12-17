import React,{propTypes} from 'react';
import loginService from '../login-service';
import constants from '../constants';

export function Login(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
    var state = {
        username : "testan",
        password : "Test@1234"
    }
    
    function textInputChangedData(name,e) {
        state[name] = e.target.value
        instance.setState(state)
    }
    
    function login(){
        
        //check if already in cache
        
        // login
        loginService.
            signin(state.username,
                   state.password,
                   postLogin)
    }
    
    function postLogin(){
    //    window.location.href = window.location.origin+
      //      window.location.pathname+"#/calendar";        
        instance.props.state.curr_view = constants.views.calendar;
        instance.props.state.changeView(instance.props.state)
    }

    instance.render = function(){
        
    return (
            <div>
            <input type="text" placeholder="Username" id = "username" onChange={textInputChangedData.bind(null,'username')} value={state.username} ></input>
            <input type="password" placeholder="Password" id = "password" onChange={textInputChangedData.bind(null,'password')} value={state.password} ></input>
            
            <button onClick={login}>Sign In</button>
            </div>
    )
    }

    return instance;
}
