import React,{propTypes} from 'react';
import loginService from '../login-service';
import constants from '../constants';

export function Login(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
    var state = {
        username : "doc",
        password : "Harsh@1234"
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

    function clear(){

    }
    
    function postLogin(){
        window.location.href = window.location.origin+
            window.location.pathname+"";        
       // instance.props.state.curr_view = constants.views.calendar;
       // instance.props.state.changeView(instance.props.state)
    }

    instance.render = function(){
        
    return (
            <div className="loginArea" >
            <h3>UPHMIS Daily Diary </h3>
            <input className="loginField" type="text" placeholder="Username" id = "username" onChange={textInputChangedData.bind(null,'username')} value={state.username} ></input>
            <input className="loginField" type="password" placeholder="Password" id = "password" onChange={textInputChangedData.bind(null,'password')} value={state.password} ></input>
            <div className="buttonDiv">
            <button className= "button" onClick={login}>Sign In</button>
            <button className= "button" onClick={clear}>Clear</button>
            </div>
            </div>
    )
    }

    return instance;
}
