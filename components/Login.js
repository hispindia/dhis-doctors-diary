import React,{propTypes} from 'react';
import loginService from '../login-service';
import constants from '../constants';
import cache from '../localstorage';

export function Login(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;
    
    var state = {
        username : "",
        password : "",
        statusMsg : "",
        loading:false
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

        state.loading=true;
        state.statusMsg="";
        instance.setState(state);
        // login
        loginService.
            signin(state.username,
                   state.password,
                   postLogin)
    }

    function clear(){
        state.username = "";
        state.password = "";
        state.statusMsg = "";
        instance.setState(state);
    }
    
    function postLogin(error){
        if (error){
            state.statusMsg = error;
            state.loading=false;
            instance.setState(state);
            return;
        }

        
        window.location.href = window.location.origin+
            window.location.pathname+"";        
       // instance.props.state.curr_view = constants.views.calendar;
       // instance.props.state.changeView(instance.props.state)
    }

    instance.render = function(){
        
    return (
            <div className="loginArea" >
            <input className="loginField" type="text" placeholder="Username" id = "username" onChange={textInputChangedData.bind(null,'username')} value={state.username} ></input>
            <input className="loginField" type="password" placeholder="Password" id = "password" onChange={textInputChangedData.bind(null,'password')} value={state.password} ></input>

            <div className="buttonDiv">
            <button className= "button1 button2" onClick={login}>Sign In</button>
            <button className= "button1 button2" onClick={clear}>Clear</button>
            <div className="redColor">{state.statusMsg}</div>
            <div><a href="https://uphmis.in/uphmis/dhis-web-commons/security/recovery.action"> Forget Password?</a></div>

            <div>
            <img 
        className="headerSyncIcon"
        src={state.loading?"./images/loader.gif":""}
                       >
                  </img>
                
        </div>
            </div>
            </div>
    )
    }

    return instance;
}
