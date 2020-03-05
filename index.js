import React from 'react';
import ReactDOM from 'react-dom'
import cache from './localstorage';
import constants from './constants';
import moment from 'moment';
//import {App} from './components/app';
import {Main} from './components/Main';


window.onload = function(){
    
    init(function(state){

        ReactDOM.render(
                <Main className = "d_page" state={state} />
                ,
            document.getElementById('root'));
        
    });    
}

function init(callback){
    var state = {            
        curr_view : undefined,
        metadata : undefined,
        curr_user : undefined,
        
        selMoment : moment(),
        currRange : null,
        loading : false,
        showLeftBar:true

    }
    
    state.curr_user = cache.get(constants.cache_curr_user);
    
    if (state.curr_user == null){
        backToLogin();
        return;
    }else{
        state.curr_view = constants.views.calendar;
        state.program_metadata = cache.get(constants.cache_program_metadata);
        
        state.curr_user_data = cache.get(constants.cache_user_prefix+state.curr_user.username);
        
        if (!state.curr_user_data){
            backToLogin();
            return;
        }
        if (state.curr_user_data.user.organisationUnits.length == 0){
            alert("No facility assigned")
            backToLogin();
            return;            
        }
        
        state.curr_user_eventMapByDate = state.curr_user_data.events.reduce(function(list,obj){
            list[moment(obj.eventDate).format("YYYY-MM-DD")] = obj;
            return list;
        },[]);

        if (state.curr_user_data.user.organisationUnits[0].organisationUnitGroups){
            state.approvalLevelDeValue = state.curr_user_data.user.organisationUnits[0].organisationUnitGroups.reduce(function(str,obj){
                
                if (constants.approvalCMO_OUgroups.includes(obj.id)){
                    str = constants.approval_status.pendingCMO;
                }
                
                return str;
            },constants.approval_status.pendingMOIC);
        }else{
            state.approvalLevelDeValue = constants.approval_status.pendingMOIC
        }
        state.curr_user_program_stage = filterPrograStageFromUserGroup();
        state.program_metadata_programStageByIdMap = state.program_metadata.programStages.reduce(function(map,obj){
            map[obj.id] = obj;
            return map;
        },[]);

        state.offlineEvents = getOfflineEvents();
        if (forcePasswordUpdate()){
            state.curr_view=constants.views.changePassword;
        }
        callback(state);
        
    }

    function forcePasswordUpdate(){

        if (!state.curr_user_data.user.surname){
            return false;
        }
        
        if (state.curr_user_data.user.surname.substr(state.curr_user_data.user.surname.length -1) == "|"){
            return true;
        }
        /*
        var avals = state.curr_user_data.user.attributeValues;
        if (avals){
            for (var i=0;i<avals.length;i++){
                var obj = avals[i];
                if (obj.attribute.id == constants.user_password_change_attribute){
                    if (obj.value == "true"){
                        return true;
                    }
                }
            }
            
        }
        */
        return false;
    }
    function backToLogin(){
        state.curr_view = constants.views.login;
        callback(state);
    
    }
    function getOfflineEvents(){

        return state.curr_user_data.events.reduce(function(count,event){
            if(event.offline){
                count=count+1;
            }
            return count;
        },0)
        
    }
    
    function filterPrograStageFromUserGroup(){
try{
        var curr_user_ug_array = state.
            curr_user_data.
            user.
            userGroups.reduce(function(list,obj){
                list.push(obj.id);
                return list;
            },[]);
        
        var ps = state.program_metadata.programStages;
        
        for (var i=0; i<ps.length;i++){
            if (ps[i].userGroupAccesses.length > 0){
                var uga = ps[i].userGroupAccesses;
                for (var j=0;j<uga.length;j++){
                    if (curr_user_ug_array.includes(uga[j].id)){
                        return ps[i].id;
                    }
                }
            }
        }
}catch (e) {
    state.curr_view = constants.views.error;
    callback(state);
}

        return undefined;
    }
}
/*
if ('serviceWorker' in navigator) {
    
   window.addEventListener('load', function() {
       navigator.serviceWorker.register('./service-worker.js').then(function(registration)  {
       console.log('SW registered: ', registration);
       }).catch(function(registrationError) {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
*/
