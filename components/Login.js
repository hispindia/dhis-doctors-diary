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
            <div className="container container-fluid" >
                <br/><br/>
                <div className="col-sm-4"> </div>
                <div className="col-sm-4"><div className="well">
                    <br/>
            <input className="form-control" type="text" placeholder="Username" id = "username" onChange={textInputChangedData.bind(null,'username')} value={state.username} ></input>
<br/>
            <input className="form-control" type="password" placeholder="Password" id = "password" onChange={textInputChangedData.bind(null,'password')} value={state.password} ></input>
<br/>
                  <center>  <span className="col-sm-3"> <button className= "btn" onClick={login}>Sign In</button></span>
                      <span className="col-sm-3"><button className= "btn" onClick={clear}>Clear</button></span></center>

            <div>{state.statusMsg}</div>
            <div>
            <img 
        className="headerSyncIcon"
        src={state.loading?"./images/loader.gif":""}
                       >
                  </img>
                
            </div></div>
            </div>
            <div className="col-sm-4"> </div>
            </div>
    )
    }

    return instance;
}
