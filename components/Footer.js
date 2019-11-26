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

        return (<img className="headerTick" src="./images/doublegreentick.png"></img>)
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

    function toggleLeftBar(){
        
        state.showLeftBar=!state.showLeftBar;
        state.changeView(state);
    }
    function goToInformationPage(){

        state.curr_view=constants.views.info;
        state.changeView(state);
    }
    
    instance.render = function(){
        return (<div className="footer">
                <div className="footerArea">
                <div className="banner_one" hidden={state.curr_view != constants.views.login ?false:true}>
                <img
                className="menuButton"
                src={!state.showLeftBar?"./images/right1.png":"./images/left2.png"}
                onClick={toggleLeftBar} title=" Menu">
                </img>
                </div>

                <div className="banner_two" hidden={state.curr_view != constants.views.login ?false:true}>
                <img className="menuButton"
                src="./images/help.ico" onClick={goToInformationPage}>
                </img> 
                </div>

                <div className="banner_three"  hidden={state.curr_view != constants.views.login ?false:true}>
                <img  className="menuButton"
                src={state.loading?"./images/loader.gif":"./images/sync.png"} title="Synchronized data">
                </img>
                { getSyncImageNotification() }

                </div>
                </div>
                </div>)
        
    }
    
    return instance;
}
