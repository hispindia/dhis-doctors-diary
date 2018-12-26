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
                className="headerTick" src="../images/doublegreentick.png"></img>)
    }
    instance.render = function(){
        
        
        return (
            <div className="headerDiv">
              <table className="headerTable">
                <tbody>
                  <tr>
                    <td className="userAndFacility"> {state.curr_user_data.user.displayName}</td>
                    
                  </tr>
                  <tr>
                    <td className="userAndFacility"> {state.curr_user_data.user.organisationUnits[0].name}</td>
                  </tr>
                </tbody>
                </table>
                
                <table className="headerSyncTable">
                <tbody>
                <tr>
                
                <td>
                <img hidden={state.curr_view == constants.views.calendar?false:true}
            className="headerSyncIcon"
            src={state.loading?"./images/loader.gif":"./images/sync.png"}
            onClick={state.loading?function(){console.log("header sync : Multiple clicks")}:synchronize}>
                </img>
                </td>
                <td rowSpan="2">
                {getSyncImageNotification() }
                </td>
                </tr>
            
                </tbody>
            </table>

                <div className="headerSettings">
                <table>
                <tbody>
              
                <tr colSpan="3">
            
                <td rowSpan="2">
                  <span className={state.online?"internetIcon online":"offline"}></span>
                </td>
                <td rowSpan="2">{state.online?"Online":"Offline"}</td>
                <td rowSpan="4" >
                <img hidden={state.curr_view == constants.views.calendar ||
                             state.curr_view == constants.views.entry?false:true}
                     className="headerSettingsIcon"
                     src="./images/settings3.png"
                     onClick={goToSettingsPage}>
                </img>
                
            </td>
                </tr>
                </tbody>
                </table>
              
              
              </div>
            </div>

        )
    }

    return instance;

    function synchronize(){
        state.loading = true;
        state.changeView(state);

        var ps = state.
            program_metadata_programStageByIdMap[state.
                                                 curr_user_program_stage];     
        
        importEvent(0,state.curr_user_data.events,ps);
        
        function importEvent(index,events,ps){
            if (index == events.length){
                refetchEvents();
                return;
            }

            var event = events[index];
            state.curr_event = event;
            if (event.offline){
                var dvMap = event.dataValues.reduce(function(map,obj){
                    map[obj.dataElement] = obj.value;
                        return map;
                },[]);

                sync.saveEvent(dvMap,ps,state,callback);
            }else{
                callback();
            }
            
            function callback(){
                importEvent(index+1,events,ps)
            }    
        }

        function refetchEvents(){
          
            sync.fetchEvents(state,function(){
                state.loading = false;
                state.changeView(state);
            })
        }
        
    }

    
    function goToSettingsPage(){
        
        state.curr_view=constants.views.settings;
        state.changeView(state);
    }
}
