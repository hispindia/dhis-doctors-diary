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
                <div className="headerDiv one">
                <div className="banner2">
                <div className="banner_one">
                <img className="banner_logo" src="./images/UPGOVT Logo.jpg"></img>
            </div>
                <div className="banner_two">
                
            Welcome <label className="italic bold"> {state.curr_view == constants.views.login?"":state.curr_user_data.user.displayName} </label>
            <br></br>
                <span className={state.online?"internetIcon online":"offline"}></span>
                {state.online?"Online":"Offline"}
                <br></br>
                <h3>Doctor Diary</h3>
            </div>
                <div className="banner_three">
                <img className="banner_logo" src="./images/NHM Logo_small.jpg"></img>
</div>
               
            </div>
                
            
            </div>

        )
    }

    return instance;

    
}
