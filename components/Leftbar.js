import React,{propTypes} from 'react';
import constants from '../constants';
import sync from '../sync-manager';
import {LeftbarSettings} from './LeftbarSetting'


export function Leftbar(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
    function getSyncImageNotification(){
        if (state.offlineEvents>0){
            return state.offlineEvents; 
        }
        
        return (<img hidden={state.curr_view == constants.views.calendar?false:true}
                className="headerTick" src="./images/doublegreentick.png"></img>)
    }
    
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
    function goToInformationPage(){

        state.curr_view=constants.views.info;
        state.changeView(state);
    }
    
    instance.render = function(){
        return (<div className="leftBar">
                <h5>#</h5>
                <table>
                <tbody>
                <tr>
                <td colSpan="2">
                <img className="headerSettingsIcon"
                hidden={state.curr_view == constants.views.calendar ||
                        state.curr_view == constants.views.entry?false:true}
                src="./images/help.ico" onClick={goToInformationPage}>
                </img> 
                </td>
                </tr>

                
                <tr>
                <td>
                <input className=""  type="button" onClick = {state.loading?function(){console.log("header sync : Multiple clicks")}:synchronize} value="Sync"></input>
                </td>
                <td>
                <div>
                <img hidden={state.curr_view == constants.views.calendar?false:true} className="headerSyncIcon"
                src={state.loading?"./images/loader.gif":"./images/sync.png"} title="Synchronized data">
                </img>
                { getSyncImageNotification() }
                </div>
                
                
                </td>
                </tr>
                
                </tbody>
                </table>

                <br></br>
                <div>
                <LeftbarSettings state={state}/>

          
                </div>
                </div>)
        
    }
    
    return instance;
}
