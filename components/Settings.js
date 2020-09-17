import React,{propTypes} from 'react';
import cache from '../localstorage';
import sync from '../sync-manager';

import constants from '../constants';

export function Settings(props){
    
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;

    instance.render = function(){

        return(
                <div>
                <div className="settingArea">
                
                <label className="lbArea"><h4>Basic</h4></label>
                <table className="settingTable">
                <tbody>
                <tr>
                    <td>
                        <input className="settingBt" type="button" onClick = {changePassword} value="Change Password"></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input className="settingBt" type="button" onClick = {changeProfile} value="My Profile"></input>
                    </td>
                </tr>



                </tbody>
                </table>

                <label className="lbArea"><h4>Advanced</h4></label>
                <table className="settingTable">
                <tbody>
                <tr>
                    <td >
                        <input className="settingBt" type="button" onClick = {reset} value="Reset"></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input disabled={isDisabled()} className={"settingBt"} type="button" onClick = {state.loading?function(){console.log("header sync : Multiple clicks")}:synchronize} value="Manual Sync"></input>
                    </td>
                </tr>
                <tr>
                    <td>{constants.version}</td>
                </tr>
            </tbody>
                </table>
                </div>
                </div>
                
        )
    }

    function back(){
        state.curr_view=constants.views.calendar;
        state.changeView(state);
        
    }
    function  isDisabled() {
        if(state.offlineEvents > 0)
        {
            return true;
        }
        else{
            return false;
        }
    }
    
    function reset(){
        cache.reset();
        state.curr_view=constants.views.login;
        state.changeView(state);
    }

    function logout(){
        if(window.confirm("If you exit all offline data will be deleted. Do you still want to exit")){
            state.curr_view=constants.views.login;
            cache.save(constants.cache_curr_user,null);
            cache.reset();
            state.changeView(state);
        }
    }

    function changeProfile(){
        state.curr_view=constants.views.profile;
        state.changeView(state);
        
    }

    function changePassword(){
        state.curr_view=constants.views.changePassword;
        state.changeView(state);
        
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
    return instance;
}
