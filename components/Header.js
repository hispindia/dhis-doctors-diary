import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';
import sync from '../sync-manager';


export function Header(props){
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    function updateOnlineStatus(event){

        if (navigator.onLine){
            state.online=true;
        }else{
            state.online=false;
        }

        state.changeView(state);
        
    }
    
    var instance = Object.create(React.Component.prototype);
    instance.props = props;

    var state = props.state;
    if(navigator.onLine){
        state.online = true;
        state.changeView(state);
    }
    
    function getSyncImage(){

        if (state.loading){
            return (
                <img hidden={state.curr_view == constants.views.calendar?false:true}
                     className="headerSyncIcon"
                     src={state.loader?"./images/loader.gif":"./images/sync.png"}
                     onClick={state.loader?function(){debugger}:synchronize}>
                </img>
                
            )
            
        }else{
            return (


                <img hidden={state.curr_view == constants.views.calendar?false:true}
                     className="headerSyncIcon"
                     src={state.loader?"./images/loader.gif":"./images/sync.png"}
                     onClick={state.loader?function(){debugger}:synchronize}>
                </img>
                
            )    
        }       
    }
    
    function getSyncImageNotification(){
        if (state.offlineEvents>0){
            return state.offlineEvents; 
        }
        
        return (<img hidden={state.curr_view == constants.views.calendar?false:true}
                     className="headerTick" src="./images/doublegreentick.png"></img>)
    }
    instance.render = function(){
        
        
        return (
            <div className="headerDiv">
              <div className="banner">
                <div className="bannerItems"> {state.curr_view == constants.views.login?"":state.curr_user_data.user.displayName}</div>
            
                <div className="bannerItems">
                  <span className={state.online?"internetIcon online":"offline"}></span>
                  {state.online?"Online":"Offline"}
                  
                </div>
              </div>
              
              
              </div>

        )
    }

    return instance;

  
}
