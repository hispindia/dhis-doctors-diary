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
    
    function goToCalendarPage(){    
        state.curr_view=constants.views.calendar;
        state.changeView(state);
    }
    function goToInformationPage(){

        state.curr_view=constants.views.info;
        state.changeView(state);
    }
    function goToReportsPage(){

        state.curr_view=constants.views.info;
        state.changeView(state);
    }

    function logout(){
        state.curr_view=constants.views.login;
        cache.save(constants.cache_curr_user,null);
        state.changeView(state);
        
    }

    function getClassNameSelectedItem(item){
        var highlight = "inset";
        var result = "";
        
        switch(item){
        case constants.views.calendar:
            if (state.curr_view == constants.views.calendar){
                result = highlight;
            }
            break;
           
        case constants.views.settings:
            if (state.curr_view == constants.views.settings){
                result = highlight;
            }
            break;
        case constants.views.reports:
            if (state.curr_view == constants.views.reports){
                result = highlight;
            }
            break;
            
        default: result =  "";
            
        }
        
        return result;

    }
    
    instance.render = function(){
        
        return (<div className="leftBar " >

                <div className="leftArea">

                <div className="la_blank">
                <label className="leftbarItem"></label>
                </div>
                
                <div className="la_blank">
                <label className="leftbarItem"></label>
                </div>

                <div className={"la_1 "+getClassNameSelectedItem(constants.views.calendar)} onClick={goToCalendarPage}>
                <label className="leftbarItem">Data Entry</label>
                </div>

                
                <div className="la_2" onClick={goToCalendarPage}>
                <label className="leftbarItem">Report</label>
                </div>

                
                <div className={"la_3 "+getClassNameSelectedItem(constants.views.settings)} onClick={goToSettingsPage}>
                <label className="leftbarItem">Settings</label>
                </div>
                
                <div className="la_blank">
                <label className="leftbarItem"></label>
                </div>

                <div className="la_blank">
                <label className="leftbarItem"></label>
                </div>
                
                <div className="la_blank">
                <label className="leftbarItem"></label>
                </div>
                
                <div className="la_4">
                <label className="leftbarItem">  <input className="" type="button" onClick = {logout} value="Log Out"></input></label>
                </div>
                
                </div>

                
                </div>)
        
    }
    
    return instance;
}
