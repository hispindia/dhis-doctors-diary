import React from 'react';
import ReactDOM from 'react-dom'
import dhis2API from './lib/dhis2API'
import cache from './localstorage';
import constants from './constants';
import moment from 'moment';
import {App} from './components/app';
import {Main} from './components/Main';


window.onload = function(){
    
    init(function(state){

        ReactDOM.render(
                <Main state={state} />
                ,
            document.getElementById('login'));
        
    });
    
    
}

function init(callback){
    var state = {            
        curr_view : undefined,
        metadata : undefined,
        curr_user : undefined,
        calendar : {}
        
    }
    
    state.curr_user = cache.get(constants.cache_curr_user);
    
    if (state.curr_user == null){
        state.curr_view = constants.views.login;
        callback(state);
    }else{
        state.curr_view = constants.views.calendar;
        state.program_metadata = cache.get(constants.cache_program_metadata);
        
        state.curr_user_data = cache.get(constants.cache_user_prefix+state.curr_user.username);
        state.curr_user_eventMapByDate = state.curr_user_data.events.reduce(function(list,obj){
            list[moment(obj.eventDate).format("YYYY-MM-DD")] = obj;
            return list;
        },[]); 
        
        
        callback(state);

        debugger
    }
}
