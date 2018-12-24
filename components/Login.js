import React,{propTypes} from 'react';
import loginService from '../login-service';
import constants from '../constants';
import cache from '../localstorage';

export function Login(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
    var state = {
        username : "",
        password : ""
    }
    
    function textInputChangedData(name,e) {
        state[name] = e.target.value
        instance.setState(state)
    }
    
    function login(){
        if (state.username == "" || state.password == ""){
            return;
        }
        
        //check if already in cache
        if (cache.get("dd_user_"+state.username)){
            cache.save("dd_current_user",{"username":state.username});
            postLogin();
            return;
        }
        
        // login
        loginService.
            signin(state.username,
                   state.password,
                   postLogin)
    }

    function clear(){
        state.username = "";
        state.password = "";
        instance.setState(state);
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
