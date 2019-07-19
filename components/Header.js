import React,{propTypes} from 'react';
import cache from '../localstorage';
import constants from '../constants';
import sync from '../sync-manager';


export function Header(props){
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    function updateOnlineStatus(event){

        if (navigator.onLine){
            synchronize();
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
    

    function synchronize(){
        console.log("Online : sync started");
        state.loading = true;
        state.changeView(state);
        
        var ps = state.
            program_metadata_programStageByIdMap[state.
                                                 curr_user_program_stage];     
        
        importEvent(0,state.curr_user_data.events,ps);
        
        function importEvent(index,events,ps){
            if (index == events.length){
                refetchEvents()
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
