import React,{propTypes} from 'react';
import constants from '../constants';
import sync from '../sync-manager';


export function Footer(props){
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
        return (<div className="footer">
                <div>
                  <img hidden={state.curr_view == constants.views.calendar?false:true}
                       className="headerSyncIcon"
                       src={state.loading?"./images/loader.gif":"./images/sync.png"}
                       onClick={state.loading?function(){console.log("header sync : Multiple clicks")}:synchronize} title="Synchronized data">
                  </img>
                  {getSyncImageNotification() }
                </div>
                <div>

                  <img hidden={state.curr_view == constants.views.calendar ||
                               state.curr_view == constants.views.entry?false:true}
            className="headerSettingsIcon"
                             src="./images/settings3.png"
                       onClick={goToSettingsPage} title="Setting">
                </img>
                </div>
                </div>)

    }
    
    return instance;
}
