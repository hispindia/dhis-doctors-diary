import React,{propTypes} from 'react';
import constants from '../constants';
import sync from '../sync-manager';
import {LeftbarSettings} from './LeftbarSetting'


export function Leftbar(props){
    var instance = Object.create(React.Component.prototype)
    instance.props = props;

    var state = props.state;
   
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


                <div className="leftArea">

                <div className="la_1">
                Data Entry
                </div>

                
                <div className="la_2">
                Report
                </div>

                
                <div className="la_3">
                Settings
                </div>

                <div className="la_4">
                Log Out
                </div>
                
                </div>

                
                </div>)
        
    }
    
    return instance;
}
